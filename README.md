# DreamGPT — Waitlist Landing

A landing page to validate demand for **DreamGPT**, a future iPhone app that lets you
record dreams by voice, remembers them all, finds long-term patterns, and lets you chat
with your full dream history.

> This repo is **only the landing page**. None of the app features are implemented — the
> page sells the vision and collects emails.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-style components (Button, Input, Accordion)
- No auth, no payments, no database

## Sections

Hero · How it works · Features · FAQ · Waitlist

## Waitlist storage

Emails POST to `/api/waitlist` and are appended to `data/waitlist.json`.

On read-only/serverless filesystems (e.g. Vercel functions) the file write fails
gracefully and entries fall back to an in-memory array for that instance, so the form
keeps working in a demo deploy. For durable storage later, swap the file logic in
`app/api/waitlist/route.ts` for a real database or an email/CRM provider.

Captured emails (local dev): `GET /api/waitlist` returns the current count, and you can
read `data/waitlist.json` directly.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Deploy

### Vercel
Import the repo (or run `vercel`). Zero config — it's a standard Next.js app.

### Railway
Create a new service from the repo. Railway auto-detects Next.js.
Build: `npm run build` · Start: `npm run start`. The container filesystem is writable,
so `data/waitlist.json` persists for the life of the deploy (use a database/volume for
true persistence).
