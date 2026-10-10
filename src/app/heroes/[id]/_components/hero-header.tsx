import Image from "next/image";
import { winRateColor } from "@/components/stat-tile";
import type { HeroStats } from "@/lib/api/types";
import { formatPercent, heroImageUrl, winRate } from "@/lib/dota";
import { ATTRIBUTES } from "@/lib/hero-stats";
import { cn } from "@/lib/utils";

export function HeroHeader({ hero }: { hero: HeroStats }) {
  const pubRate = winRate(hero.pub_win, hero.pub_pick);
  const proRate = winRate(hero.pro_win, hero.pro_pick);

  const stats = [
    {
      label: "Win rate",
      value: formatPercent(pubRate),
      className: winRateColor(pubRate),
    },
    { label: "Ranked matches", value: hero.pub_pick.toLocaleString() },
    {
      label: "Pro picks / bans",
      value: `${hero.pro_pick} / ${hero.pro_ban}`,
    },
    {
      label: "Pro win rate",
      value: formatPercent(proRate),
      className: winRateColor(proRate),
    },
  ];

  return (
    <header className="overflow-hidden hud-panel">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_0%_0%,var(--glow),transparent_70%)] opacity-50"
      />
      <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
        <div className="shrink-0 overflow-hidden rounded-sm border-2 border-gold/70 shadow-[0_0_24px_-6px_var(--glow)]">
          <Image
            src={heroImageUrl(hero.img)}
            alt=""
            width={256}
            height={144}
            priority
            className="h-[108px] w-48 object-cover sm:h-36 sm:w-64"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-muted-foreground uppercase">
            {ATTRIBUTES[hero.primary_attr] ?? hero.primary_attr} ·{" "}
            {hero.attack_type}
          </p>
          <h1 className="mt-1 truncate font-heading text-3xl font-bold tracking-wide sm:text-4xl">
            {hero.localized_name}
          </h1>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {hero.roles.map((role) => (
              <li
                key={role}
                className="rounded-sm border border-frame bg-muted/40 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {role}
              </li>
            ))}
          </ul>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[11px] tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </dt>
                <dd
                  className={cn(
                    "text-lg font-bold tabular-nums",
                    stat.className,
                  )}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </header>
  );
}
