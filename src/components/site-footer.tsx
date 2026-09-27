import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <div className="hud-divider" />
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-center gap-1.5 px-4 text-sm text-muted-foreground sm:px-6">
        Made with
        <Heart className="size-4 fill-red-500 text-red-500" aria-label="love" />
        by
        <a
          href="https://ashutoshdash.in/?utm_source=dota"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Ashutosh Dash
        </a>
      </div>
    </footer>
  );
}
