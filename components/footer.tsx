import { Moon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Moon className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">DreamGPT</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your subconscious has memory. · Coming soon to iPhone.
          </p>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} DreamGPT
          </p>
        </div>
      </div>
    </footer>
  );
}
