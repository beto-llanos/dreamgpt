import {
  AudioLines,
  BookOpen,
  MessageCircle,
  Clapperboard,
  Sparkles,
  Wand2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

const features = [
  {
    icon: AudioLines,
    title: "Voice Recording",
    description:
      "Capture dreams hands-free the second you wake. Speak naturally and let DreamGPT do the rest.",
    className: "md:col-span-2",
  },
  {
    icon: BookOpen,
    title: "Dream Journal",
    description:
      "Every dream, beautifully archived and searchable — your private, lifelong record.",
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    description:
      "Themes, symbols and emotions surfaced automatically across your history.",
  },
  {
    icon: MessageCircle,
    title: "Dream Chat",
    description:
      "Ask anything. Talk to your full dream history like a conversation with your subconscious.",
    className: "md:col-span-2",
  },
  {
    icon: Clapperboard,
    title: "Dream Videos",
    description:
      "Watch your dreams reimagined as images and short films, generated from your own words.",
  },
  {
    icon: Wand2,
    title: "Dream Wrapped",
    description:
      "Your year in dreams. A shareable recap of the patterns, moods and worlds you visited.",
    className: "md:col-span-2",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
            Features
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Everything your dreams have been trying to tell you.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={(i % 3) * 100}
              className={cn(feature.className)}
            >
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card/40 p-7 transition-all duration-300 hover:border-primary/30 hover:bg-card/70">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
