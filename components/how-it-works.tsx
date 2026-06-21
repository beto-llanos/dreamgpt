import { Brain, Mic, Waypoints } from "lucide-react";

import { Reveal } from "@/components/reveal";

const steps = [
  {
    icon: Mic,
    step: "Step 1",
    title: "Record your dream",
    description:
      "The moment you wake up, just talk. DreamGPT captures the whole thing by voice — no typing, no friction, before the memory fades.",
  },
  {
    icon: Brain,
    step: "Step 2",
    title: "AI remembers everything",
    description:
      "Every dream is transcribed, understood and stored. Your entire dream history becomes a memory the AI can recall — not a folder you forget.",
  },
  {
    icon: Waypoints,
    step: "Step 3",
    title: "Discover patterns over time",
    description:
      "Recurring places, people and emotions surface on their own. See the threads running through months and years of your subconscious.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
            How it works
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            From a whisper at dawn to a map of your mind.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="group relative h-full rounded-3xl border border-border bg-card/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card/70">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
