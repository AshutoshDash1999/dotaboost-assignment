import {
  IconBuildingCastle,
  IconClock,
  IconCoins,
  IconCrosshair,
  IconFlame,
  IconHeartPlus,
  IconSparkles,
  IconSwords,
} from "@tabler/icons-react";
import { StatTile } from "@/components/player/stat-tile";
import { SectionHeading } from "@/components/section-heading";
import type { PlayerTotal } from "@/lib/api/types";
import { formatCompact, formatDuration } from "@/lib/dota";

const average = (totals: Map<string, PlayerTotal>, field: string) => {
  const total = totals.get(field);
  return total && total.n > 0 ? total.sum / total.n : null;
};

const fixed = (value: number | null, digits = 0) =>
  value === null ? "—" : value.toFixed(digits);

export function AverageStats({ totals }: { totals: PlayerTotal[] }) {
  const byField = new Map(totals.map((total) => [total.field, total]));
  const avg = (field: string) => average(byField, field);
  const matches = byField.get("kills")?.n ?? 0;

  const kills = avg("kills");
  const deaths = avg("deaths");
  const assists = avg("assists");
  const duration = avg("duration");
  const heroDamage = avg("hero_damage");
  const towerDamage = avg("tower_damage");
  const healing = avg("hero_healing");

  const stats = [
    {
      label: "K / D / A",
      icon: IconSwords,
      value: `${fixed(kills, 1)} / ${fixed(deaths, 1)} / ${fixed(assists, 1)}`,
      hint: `KDA ${fixed(avg("kda"), 2)}`,
    },
    { label: "GPM", icon: IconCoins, value: fixed(avg("gold_per_min")) },
    { label: "XPM", icon: IconSparkles, value: fixed(avg("xp_per_min")) },
    {
      label: "Last hits",
      icon: IconCrosshair,
      value: fixed(avg("last_hits")),
      hint: `${fixed(avg("denies"))} denies`,
    },
    {
      label: "Hero damage",
      icon: IconFlame,
      value: heroDamage === null ? "—" : formatCompact(heroDamage),
    },
    {
      label: "Tower damage",
      icon: IconBuildingCastle,
      value: towerDamage === null ? "—" : formatCompact(towerDamage),
    },
    {
      label: "Healing",
      icon: IconHeartPlus,
      value: healing === null ? "—" : formatCompact(healing),
    },
    {
      label: "Match length",
      icon: IconClock,
      value: duration === null ? "—" : formatDuration(Math.round(duration)),
    },
  ];

  return (
    <section className="space-y-4">
      <SectionHeading
        title="Career averages"
        aside={
          matches > 0 && (
            <p className="text-right text-xs text-muted-foreground tabular-nums">
              Across {matches.toLocaleString()} matches
            </p>
          )
        }
      />
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </dl>
    </section>
  );
}
