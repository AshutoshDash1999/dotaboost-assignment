import type { Icon } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  icon: StatIcon,
  value,
  hint,
  valueClassName,
  aside,
}: {
  label: string;
  icon: Icon;
  value: ReactNode;
  hint?: ReactNode;
  valueClassName?: string;
  aside?: ReactNode;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex items-start gap-3 max-sm:px-3">
        <div className="hidden size-9 shrink-0 items-center justify-center rounded-sm border border-frame bg-gold/10 text-gold shadow-[inset_0_0_10px_-4px_var(--glow)] sm:flex">
          <StatIcon className="size-4.5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <dt className="truncate text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            {label}
          </dt>
          <dd
            className={cn(
              "mt-0.5 text-lg font-bold whitespace-nowrap tabular-nums sm:text-xl",
              valueClassName,
            )}
          >
            {value}
          </dd>
          {hint && (
            <dd className="text-xs text-muted-foreground tabular-nums">
              {hint}
            </dd>
          )}
        </div>
        {aside}
      </CardContent>
    </Card>
  );
}

// Radiant green when winning more than losing, Dire red otherwise
export function winRateColor(rate: number | null) {
  if (rate === null) return undefined;
  return rate >= 50 ? "text-radiant" : "text-dire";
}
