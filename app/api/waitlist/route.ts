import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In production this points at a mounted Railway volume (WAITLIST_DIR=/data)
// so captured emails survive redeploys. Falls back to the repo's ./data locally.
const DATA_DIR = process.env.WAITLIST_DIR
  ? process.env.WAITLIST_DIR
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

// Basic, dependency-free email check — good enough for a waitlist.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Entry {
  email: string;
  joinedAt: string;
}

// Fallback store for read-only filesystems (e.g. Vercel serverless),
// where writing the JSON file will fail. Lives for the lifetime of the
// serverless instance — enough to keep the form working in a demo deploy.
const memoryStore: Entry[] = [];

async function readEntries(): Promise<Entry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeEntries(entries: Entry[]): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
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

  const fileEntries = await readEntries();
  const entries = fileEntries.length ? fileEntries : memoryStore;

  if (entries.some((e) => e.email === normalized)) {
    return NextResponse.json({ ok: true, alreadyJoined: true });
  }

  const entry: Entry = { email: normalized, joinedAt: new Date().toISOString() };
  const next = [...entries, entry];

  const persisted = await writeEntries(next);
  if (!persisted) {
    // Read-only FS: keep it in memory so the demo still succeeds.
    if (!memoryStore.some((e) => e.email === normalized)) {
      memoryStore.push(entry);
    }
  }

  return NextResponse.json({ ok: true, alreadyJoined: false });
}

export async function GET(request: Request) {
  const entries = await readEntries();
  const all = entries.length ? entries : memoryStore;

  // Private admin view: GET /api/waitlist?key=ADMIN_KEY returns the full list.
  // Without a matching key, only the count is exposed.
  const key = new URL(request.url).searchParams.get("key");
  if (process.env.ADMIN_KEY && key === process.env.ADMIN_KEY) {
    return NextResponse.json({ count: all.length, entries: all });
  }

  return NextResponse.json({ count: all.length });
}
