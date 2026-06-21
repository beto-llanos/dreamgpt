import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";

const faqs = [
  {
    question: "How does DreamGPT work?",
    answer:
      "When you wake up, you record your dream by voice. DreamGPT transcribes and understands it, then adds it to a memory of everything you've ever logged. Over time it surfaces recurring themes and lets you chat with your full dream history.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your dreams are deeply personal, and we treat them that way. Your journal is yours — private by default, never sold, and never used to train public models. You'll always be able to export or delete everything.",
  },
  {
    question: "When will the app launch?",
    answer:
      "We're building DreamGPT now and opening access in waves. Join the waitlist and you'll be among the first invited when the iPhone app goes live.",
  },
  {
    question: "Will Android be supported?",
    answer:
      "DreamGPT launches on iPhone first so we can get the voice and morning experience exactly right. Android is on the roadmap — join the waitlist and we'll let you know when it's coming.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
              FAQ
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Questions, answered.
            </h2>
          </Reveal>

          <Reveal delay={120} className="mt-12">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`item-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
