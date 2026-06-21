"use client";

import * as React from "react";
import { Check, Loader2, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/reveal";

type Status = "idle" | "loading" | "success" | "error";

export function Waitlist() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(
        data?.alreadyJoined
          ? "You're already on the list. We'll be in touch."
          : "You're on the list. We'll let you know the moment DreamGPT opens."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section id="waitlist" className="relative py-24 sm:py-32">
      <div className="container">
        <Reveal>
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2.5rem] border border-border bg-card/50 p-10 text-center sm:p-14">
            <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" aria-hidden />
            <div className="relative">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Moon className="h-6 w-6" />
              </span>

              <h2 className="mt-7 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Be there when DreamGPT opens.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
                Join the waitlist for early access. One email when it&apos;s your
                turn — nothing else.
              </p>

              {status === "success" ? (
                <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{message}</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                >
                  <Input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    aria-label="Email address"
                    className="sm:flex-1"
                  />
                  <Button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Joining
                      </>
                    ) : (
                      "Join the Waitlist"
                    )}
                  </Button>
                </form>
              )}

              {status === "error" && (
                <p className="mt-3 text-sm text-red-400">{message}</p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
