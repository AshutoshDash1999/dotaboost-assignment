import type { ReactNode } from "react";

// Shared shell for the custom tooltips; matches ChartTooltipContent's look
export function ChartTooltipCard({
  title,
  rows,
}: {
  title: ReactNode;
  rows: { label: string; value: ReactNode; color?: string }[];
}) {
  return (
    <div className="grid min-w-36 gap-1.5 rounded-sm border border-frame bg-popover/95 px-2.5 py-1.5 text-xs shadow-[var(--panel-shadow),0_0_20px_-8px_var(--glow)] backdrop-blur-sm">
      <div className="font-heading font-semibold text-gold">{title}</div>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-2">
          {row.color && (
            <span
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: row.color }}
            />
          )}
          <span className="flex-1 text-muted-foreground">{row.label}</span>
          <span className="font-mono font-medium tabular-nums">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
