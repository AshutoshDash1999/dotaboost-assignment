"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartTooltipCard } from "@/components/chart-tooltip";
import { HeroCell } from "@/components/hero-cell";
import { QueryError } from "@/components/query-error";
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
import {
  useHeroes,
  usePlayerRankings,
  usePlayerRatings,
} from "@/lib/api/hooks";
import type { PlayerRating } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { getRankLabel } from "@/lib/rank";
import { cn } from "@/lib/utils";
import { PlayerTabSkeleton } from "./player-skeleton";

const chartConfig = {
  rank: { label: "Rank", color: "var(--chart-1)" },
} satisfies ChartConfig;

// "Top 0.3%" reads better than a raw percentile
function topPercent(percentRank: number) {
  const top = (1 - percentRank) * 100;
  return `Top ${top < 1 ? top.toFixed(2) : top.toFixed(1)}%`;
}

function RankHistory({ ratings }: { ratings: PlayerRating[] }) {
  const data = [...ratings]
    .sort((a, b) => a.time - b.time)
    .map((rating) => ({ time: rating.time, rank: rating.rank_tier }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rank history</CardTitle>
        <CardDescription>Medal recorded after ranked matches</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-64">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 24 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={(time: number) =>
                dayjs.unix(time).format("MMM YY")
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={72}
              domain={["dataMin - 5", "dataMax + 5"]}
              tickFormatter={(rank: number) => getRankLabel(Math.round(rank))}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as
                  | (typeof data)[number]
                  | undefined;
                if (!active || !point) return null;
                return (
                  <ChartTooltipCard
                    title={getRankLabel(point.rank)}
                    rows={[
                      {
                        label: "Date",
                        value: dayjs.unix(point.time).format("D MMM YYYY"),
                      },
                    ]}
                  />
                );
              }}
            />
            <Line
              dataKey="rank"
              type="stepAfter"
              stroke="var(--color-rank)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function PlayerRankings({ accountId }: { accountId: string }) {
  const rankings = usePlayerRankings(accountId);
  const ratings = usePlayerRatings(accountId);
  const heroes = useHeroes();

  const queries = [rankings, ratings, heroes];

  if (queries.some((query) => query.isError)) {
    return <QueryError message="Couldn't load rankings." queries={queries} />;
  }

  if (queries.some((query) => query.isLoading)) return <PlayerTabSkeleton />;

  const sorted = [...rankings.rankings].sort(
    (a, b) => b.percent_rank - a.percent_rank,
  );

  return (
    <div className="space-y-8">
      {ratings.ratings.length > 1 && <RankHistory ratings={ratings.ratings} />}
      <Card>
        <CardHeader>
          <CardTitle>Hero rankings</CardTitle>
          <CardDescription>
            How this player's hero score compares with everyone else on that
            hero
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              No hero rankings yet. They need recent ranked matches.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((ranking) => {
                const elite = ranking.percent_rank >= 0.99;
                return (
                  <li
                    key={ranking.hero_id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-sm border border-frame bg-muted/30 px-3 py-2",
                      elite && "border-gold/50 bg-gold/10",
                    )}
                  >
                    <div className="min-w-0">
                      <HeroCell hero={heroes.heroes[ranking.hero_id]} />
                    </div>
                    <div className="shrink-0 text-right tabular-nums">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          elite && "text-gold",
                        )}
                      >
                        {topPercent(ranking.percent_rank)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Score {Math.round(ranking.score).toLocaleString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
