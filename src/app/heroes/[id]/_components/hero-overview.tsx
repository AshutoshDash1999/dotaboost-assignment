"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltipCard } from "@/components/chart-tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useHeroDurations, useHeroLaneRoles } from "@/lib/api/hooks";
import type { HeroStats } from "@/lib/api/types";
import { formatPercent, LANE_ROLES, winRate } from "@/lib/dota";
import { RANK_BRACKETS } from "@/lib/hero-stats";

const chartConfig = {
  rate: { label: "Win rate", color: "var(--chart-1)" },
} satisfies ChartConfig;

// Bins with fewer games are noise
const MIN_DURATION_GAMES = 20;

type RateRow = { label: string; rate: number; games: number };

function WinRateChart({
  title,
  description,
  data,
  empty,
}: {
  title: string;
  description: string;
  data: RateRow[];
  empty: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">{empty}</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-56">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={48}
                domain={[
                  (min: number) => Math.floor(Math.min(min, 50) - 2),
                  (max: number) => Math.ceil(Math.max(max, 50) + 2),
                ]}
                tickFormatter={(rate: number) => `${rate}%`}
              />
              <ReferenceLine
                y={50}
                stroke="var(--border)"
                strokeDasharray="4 4"
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={({ active, payload }) => {
                  const row = payload?.[0]?.payload as RateRow | undefined;
                  if (!active || !row) return null;
                  return (
                    <ChartTooltipCard
                      title={row.label}
                      rows={[
                        { label: "Win rate", value: formatPercent(row.rate) },
                        { label: "Games", value: row.games.toLocaleString() },
                      ]}
                    />
                  );
                }}
              />
              <Bar dataKey="rate" radius={2}>
                {data.map((row) => (
                  <Cell
                    key={row.label}
                    fill={row.rate >= 50 ? "var(--radiant)" : "var(--dire)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function BaseStats({ hero }: { hero: HeroStats }) {
  const stats = [
    ["Strength", `${hero.base_str} + ${hero.str_gain}`],
    ["Agility", `${hero.base_agi} + ${hero.agi_gain}`],
    ["Intelligence", `${hero.base_int} + ${hero.int_gain}`],
    ["Base health", hero.base_health],
    ["Base mana", hero.base_mana],
    ["Armor", hero.base_armor],
    ["Magic resist", `${hero.base_mr}%`],
    ["Damage", `${hero.base_attack_min}–${hero.base_attack_max}`],
    ["Attack range", hero.attack_range],
    ["Attack rate", hero.attack_rate],
    ["Move speed", hero.move_speed],
    ["Vision", `${hero.day_vision} / ${hero.night_vision}`],
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attributes</CardTitle>
        <CardDescription>
          Base values at level 1, plus gain per level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11px] tracking-wider text-muted-foreground uppercase">
                {label}
              </dt>
              <dd className="font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export function HeroOverview({ hero }: { hero: HeroStats }) {
  const heroId = String(hero.id);
  const durations = useHeroDurations(heroId);
  const laneRoles = useHeroLaneRoles(heroId);

  const bracketData: RateRow[] = RANK_BRACKETS.flatMap((bracket) => {
    const picks = hero[`${bracket.value}_pick`];
    const rate = winRate(hero[`${bracket.value}_win`], picks);
    return rate === null ? [] : [{ label: bracket.label, rate, games: picks }];
  });

  const durationData: RateRow[] = [...durations.durations]
    .filter((bin) => bin.games_played >= MIN_DURATION_GAMES)
    .sort((a, b) => a.duration_bin - b.duration_bin)
    .map((bin) => ({
      label: `${Math.round(bin.duration_bin / 60)}m`,
      rate: winRate(bin.wins, bin.games_played) ?? 0,
      games: bin.games_played,
    }));

  // The scenario splits each lane by game length; fold those together
  const laneTotals = new Map<number, { games: number; wins: number }>();
  for (const row of laneRoles.laneRoles) {
    const total = laneTotals.get(row.lane_role) ?? { games: 0, wins: 0 };
    total.games += Number(row.games);
    total.wins += Number(row.wins);
    laneTotals.set(row.lane_role, total);
  }
  const laneData: RateRow[] = Object.entries(LANE_ROLES).flatMap(
    ([id, label]) => {
      const total = laneTotals.get(Number(id));
      const rate = total ? winRate(total.wins, total.games) : null;
      return rate === null || !total
        ? []
        : [{ label, rate, games: total.games }];
    },
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BaseStats hero={hero} />
      <WinRateChart
        title="Win rate by rank"
        description="Ranked matches, per medal"
        data={bracketData}
        empty="No ranked matches recorded."
      />
      <WinRateChart
        title="Win rate by game length"
        description="Matches binned by duration"
        data={durationData}
        empty={durations.isLoading ? "Loading…" : "Not enough matches yet."}
      />
      <WinRateChart
        title="Win rate by lane"
        description="Matches with lane data, by lane role"
        data={laneData}
        empty={laneRoles.isLoading ? "Loading…" : "No lane data yet."}
      />
    </div>
  );
}
