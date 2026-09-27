import Link from "next/link";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <svg
            viewBox="0 0 32 32"
            className="size-7 shrink-0"
            aria-hidden="true"
          >
            <path
              d="M16 2 30 16 16 30 2 16Z"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2"
            />
            <path d="M16 9 23 16 16 23 9 16Z" fill="var(--gold)" />
          </svg>
          <span className="hud-title text-lg tracking-[0.15em]">
            Dota Stats
          </span>
        </Link>
        <AnimatedThemeToggler
          className={buttonVariants({ variant: "outline", size: "icon" })}
        />
      </div>
      <div className="hud-divider" />
    </header>
  );
}
