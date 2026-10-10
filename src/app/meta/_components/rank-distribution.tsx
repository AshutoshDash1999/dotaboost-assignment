"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartTooltipCard } from "@/components/chart-tooltip";
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
import { useRankDistribution } from "@/lib/api/hooks";
import { formatCompact } from "@/lib/dota";
import { getRankLabel } from "@/lib/rank";

const chartConfig = {
  count: { label: "Players", color: "var(--chart-1)" },
} satisfies ChartConfig;

type Row = { tier: number; count: number; percentile: number };

export function RankDistribution() {
  const query = useRankDistribution();

  if (query.isError) {
    return (
      <QueryError
        message="Couldn't load the rank distribution."
        queries={[query]}
      />
    );
  }

  const total = query.distribution?.sum.count ?? 0;
  const data: Row[] = (query.distribution?.rows ?? []).map((row) => ({
    tier: row.bin,
    count: row.count,
    // Share of players at or below this rank
    percentile: total ? (row.cumulative_sum / total) * 100 : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rank distribution</CardTitle>
        <CardDescription>
          {total
            ? `${formatCompact(total)} ranked players by medal and star`
            : "Ranked players by medal and star"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <div className="h-64 rounded-sm hud-skeleton" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -4 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="tier"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                // Label each medal once, at its first star
                tickFormatter={(tier: number) =>
                  tier % 10 === 1 || tier === 80
                    ? getRankLabel(tier).split(" ")[0]
                    : ""
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={48}
                tickFormatter={(count: number) => formatCompact(count)}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={({ active, payload }) => {
                  const row = payload?.[0]?.payload as Row | undefined;
                  if (!active || !row) return null;
                  return (
                    <ChartTooltipCard
                      title={getRankLabel(row.tier)}
                      rows={[
                        { label: "Players", value: row.count.toLocaleString() },
                        {
                          label: "Percentile",
                          value: `${row.percentile.toFixed(1)}%`,
                        },
                      ]}
                    />
                  );
                }}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={2} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
