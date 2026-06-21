import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Pool } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Basic, dependency-free email check — good enough for a waitlist.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Entry {
  email: string;
  joinedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Primary store: Postgres (Railway). Durable across redeploys.               */
/* -------------------------------------------------------------------------- */

let pool: Pool | null = null;
let tableReady = false;

function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false, // private network inside Railway; no TLS needed
      max: 3,
    });
  }
  return pool;
}

async function ensureTable(p: Pool) {
  if (tableReady) return;
  await p.query(
    `CREATE TABLE IF NOT EXISTS waitlist (
       id        SERIAL PRIMARY KEY,
       email     TEXT UNIQUE NOT NULL,
       joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
     )`
  );
  tableReady = true;
}

/* -------------------------------------------------------------------------- */
/* Fallback store: JSON file (mounted volume) + in-memory, if Postgres is     */
/* unavailable. Keeps the form working no matter what.                        */
/* -------------------------------------------------------------------------- */

const DATA_DIR = process.env.WAITLIST_DIR
  ? process.env.WAITLIST_DIR
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");
const memoryStore: Entry[] = [];

async function fileRead(): Promise<Entry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function fileWrite(entries: Entry[]): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  let email: unknown;
  try {
    email = (await request.json())?.email;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const normalized = email.trim().toLowerCase();

  const p = getPool();
  if (p) {
    try {
      await ensureTable(p);
      const res = await p.query(
        `INSERT INTO waitlist (email) VALUES ($1)
         ON CONFLICT (email) DO NOTHING
         RETURNING email`,
        [normalized]
      );
      return NextResponse.json({ ok: true, alreadyJoined: res.rowCount === 0 });
    } catch (err) {
      console.error("waitlist: postgres write failed, falling back to file", err);
      // fall through to file/memory
    }
  }

  const fileEntries = await fileRead();
  const entries = fileEntries.length ? fileEntries : memoryStore;
  if (entries.some((e) => e.email === normalized)) {
    return NextResponse.json({ ok: true, alreadyJoined: true });
  }
  const entry: Entry = { email: normalized, joinedAt: new Date().toISOString() };
  if (!(await fileWrite([...entries, entry]))) {
    if (!memoryStore.some((e) => e.email === normalized)) memoryStore.push(entry);
  }
  return NextResponse.json({ ok: true, alreadyJoined: false });
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  const isAdmin = !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;

  const p = getPool();
  if (p) {
    try {
      await ensureTable(p);
      if (isAdmin) {
        const res = await p.query(
          `SELECT email, joined_at FROM waitlist ORDER BY joined_at ASC`
        );
        const entries: Entry[] = res.rows.map((r) => ({
          email: r.email,
          joinedAt: new Date(r.joined_at).toISOString(),
        }));
        return NextResponse.json({ count: entries.length, entries });
      }
      const res = await p.query(`SELECT count(*)::int AS c FROM waitlist`);
      return NextResponse.json({ count: res.rows[0].c });
    } catch (err) {
      console.error("waitlist: postgres read failed, falling back to file", err);
      // fall through
    }
  }

  const fileEntries = await fileRead();
  const all = fileEntries.length ? fileEntries : memoryStore;
  if (isAdmin) return NextResponse.json({ count: all.length, entries: all });
  return NextResponse.json({ count: all.length });
}

// Admin-only cleanup: DELETE /api/waitlist?key=ADMIN_KEY&email=foo  (one)
//                     DELETE /api/waitlist?key=ADMIN_KEY&all=1       (everything)
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = url.searchParams.get("email")?.trim().toLowerCase();
  const all = url.searchParams.get("all") === "1";
  if (!email && !all) {
    return NextResponse.json(
      { error: "Pass ?email=... or ?all=1" },
      { status: 400 }
    );
  }

  const p = getPool();
  if (p) {
    try {
      await ensureTable(p);
      if (all) {
        await p.query(`TRUNCATE waitlist RESTART IDENTITY`);
      } else {
        await p.query(`DELETE FROM waitlist WHERE email = $1`, [email]);
      }
      const res = await p.query(`SELECT count(*)::int AS c FROM waitlist`);
      return NextResponse.json({ ok: true, count: res.rows[0].c });
    } catch (err) {
      console.error("waitlist: postgres delete failed, falling back to file", err);
      // fall through
    }
  }

  const entries = await fileRead();
  const next = all ? [] : entries.filter((e) => e.email !== email);
  await fileWrite(next);
  memoryStore.length = 0;
  if (!all) memoryStore.push(...next);
  return NextResponse.json({ ok: true, count: next.length });
}
