import { cn } from "@/lib/utils";

export function TierBadge({ tier }: { tier: string | null | undefined }) {
  if (!tier) return null;

  return (
    <span
      className={cn(
        "rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
        tier === "premium"
          ? "border-gold/50 bg-gold/15 text-gold"
          : "border-frame bg-muted/40 text-muted-foreground",
      )}
    >
      {tier}
    </span>
  );
}
