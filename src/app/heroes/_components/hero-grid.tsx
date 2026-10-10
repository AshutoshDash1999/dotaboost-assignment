import Image from "next/image";
import { HeroLink } from "@/components/entity-link";
import { winRateColor } from "@/components/stat-tile";
import { formatPercent, heroImageUrl } from "@/lib/dota";
import { cn } from "@/lib/utils";
import type { HeroRow } from "./hero-table";

export function HeroGrid({ rows }: { rows: HeroRow[] }) {
  const sorted = [...rows].sort((a, b) =>
    a.hero.localized_name.localeCompare(b.hero.localized_name),
  );

  return (
    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
      {sorted.map((row) => (
        <li key={row.hero.id}>
          <HeroLink
            id={row.hero.id}
            className="group block overflow-hidden rounded-sm ring-1 ring-frame transition-shadow hover:shadow-[0_0_18px_-4px_var(--glow)]"
          >
            <div className="relative aspect-[16/9]">
              <Image
                src={heroImageUrl(row.hero.img)}
                alt=""
                fill
                sizes="(min-width: 1024px) 14vw, (min-width: 640px) 20vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between gap-1 bg-card px-2 py-1 text-xs">
              <span className="truncate font-medium">
                {row.hero.localized_name}
              </span>
              <span
                className={cn(
                  "shrink-0 tabular-nums",
                  winRateColor(row.winRate),
                )}
              >
                {formatPercent(row.winRate)}
              </span>
            </div>
          </HeroLink>
        </li>
      ))}
    </ul>
  );
}
