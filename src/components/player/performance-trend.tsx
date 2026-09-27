"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartTooltipCard } from "@/components/player/chart-tooltip";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import type { HeroConstant, RecentMatch } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { isWin } from "@/lib/dota";

const chartConfig = {
  gpm: { label: "GPM", color: "var(--chart-1)" },
  xpm: { label: "XPM", color: "var(--chart-2)" },
} satisfies ChartConfig;

type TrendPoint = {
  index: number;
  gpm: number;
  xpm: number;
  hero: string;
  won: boolean;
  kda: string;
  playedAt: number;
};

export function PerformanceTrend({
  matches,
  heroes,
}: {
  matches: RecentMatch[];
  heroes: Record<string, HeroConstant>;
}) {
  // recentMatches is newest first; plot oldest → newest
  const data: TrendPoint[] = [...matches].reverse().map((match, index) => ({
    index: index + 1,
    gpm: match.gold_per_min,
    xpm: match.xp_per_min,
    hero: heroes[match.hero_id]?.localized_name ?? "Unknown hero",
    won: isWin(match),
    kda: `${match.kills} / ${match.deaths} / ${match.assists}`,
    playedAt: match.start_time,
  }));

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Farm trend</CardTitle>
        <CardDescription>
          GPM and XPM over the last {data.length} matches
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No recent public matches.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="index"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                tickFormatter={(index: number) =>
                  index === data.length ? "Latest" : `#${index}`
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={48}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  const point = payload?.[0]?.payload as TrendPoint | undefined;
                  if (!active || !point) return null;
                  return (
                    <ChartTooltipCard
                      title={`${point.hero} · ${point.won ? "Win" : "Loss"}`}
                      rows={[
                        {
                          label: "GPM",
                          value: point.gpm,
                          color: "var(--color-gpm)",
                        },
                        {
                          label: "XPM",
                          value: point.xpm,
                          color: "var(--color-xpm)",
                        },
                        { label: "K / D / A", value: point.kda },
                        {
                          label: "Played",
                          value: dayjs.unix(point.playedAt).fromNow(),
                        },
                      ]}
                    />
                  );
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
              {(["gpm", "xpm"] as const).map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
