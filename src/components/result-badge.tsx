import { cn } from "@/lib/utils";

export function ResultBadge({ won }: { won: boolean }) {
  return (
    <span
      className={cn(
        "rounded-sm border px-1.5 py-0.5 font-heading text-[11px] font-bold tracking-wider uppercase",
        won
          ? "border-radiant/40 bg-radiant/10 text-radiant"
          : "border-dire/40 bg-dire/10 text-dire",
      )}
    >
      {won ? "Victory" : "Defeat"}
    </span>
  );
}
