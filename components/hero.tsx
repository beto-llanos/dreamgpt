"use client";

import { Mic, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

function scrollToWaitlist() {
  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 sm:pt-48 sm:pb-32">
      {/* Ambient light */}
      <div className="pointer-events-none absolute inset-0 bg-aurora" aria-hidden />
      {/* Fine grid, masked toward the top */}
      <div
        className="grid-mask pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Coming soon to iPhone
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-7 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              <span className="gradient-text">Your subconscious</span>
              <br />
              <span className="gradient-text">has memory.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
              Talk about your dreams. Discover patterns hidden across years.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={scrollToWaitlist}>
                Join the Waitlist
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See how it works
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-5 text-xs text-muted-foreground/70">
              No spam. Just an invite when DreamGPT opens.
            </p>
          </Reveal>
        </div>

        {/* Voice capture visual */}
        <Reveal delay={360}>
          <div className="relative mx-auto mt-20 max-w-md">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl animate-pulse-glow" aria-hidden />
            <div className="glass relative rounded-[2rem] border border-border/80 p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_-4px_hsl(var(--primary))]">
                  <Mic className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Recording dream…</p>
                  <p className="text-xs text-muted-foreground">06:42 AM · Tuesday</p>
                </div>
                <span className="ml-auto text-xs font-medium text-primary">0:18</span>
              </div>

              {/* Waveform */}
              <div className="mt-6 flex h-16 items-center justify-center gap-1">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-gradient-to-t from-primary/40 to-accent animate-float"
                    style={{
                      height: `${20 + Math.abs(Math.sin(i * 0.9)) * 80}%`,
                      animationDelay: `${(i % 8) * 0.18}s`,
                      animationDuration: `${2.4 + (i % 5) * 0.3}s`,
                    }}
                  />
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-border/70 bg-background/40 p-4">
                <p className="text-sm leading-relaxed text-foreground/80">
                  &ldquo;I was back in the old house again, but the hallway kept
                  getting longer the more I walked…&rdquo;
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["recurring", "childhood home", "anxiety"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
