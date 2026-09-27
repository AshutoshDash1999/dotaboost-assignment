import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  aside,
  className,
}: {
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <h2 className="hud-title shrink-0 text-base sm:text-lg">{title}</h2>
      <div className="hud-rule min-w-8 flex-1" />
      {aside}
    </div>
  );
}
