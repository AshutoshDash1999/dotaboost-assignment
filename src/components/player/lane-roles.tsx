"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
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
  ChartTooltip,
} from "@/components/ui/chart";
import type { CategoryCount } from "@/lib/api/types";
import { formatPercent, LANE_ROLES, winRate } from "@/lib/dota";

const chartConfig = {
  games: { label: "Games", color: "var(--chart-1)" },
} satisfies ChartConfig;

type LaneRow = {
  role: string;
  games: number;
  win: number;
  rate: number | null;
};

export function LaneRoles({
  laneRoles,
}: {
  laneRoles: Record<string, CategoryCount> | undefined;
}) {
  const data: LaneRow[] = Object.entries(LANE_ROLES).map(([id, role]) => {
    const count = laneRoles?.[id] ?? { games: 0, win: 0 };
    return { role, ...count, rate: winRate(count.win, count.games) };
  });
  const hasData = data.some((row) => row.games > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lanes</CardTitle>
        <CardDescription>Games and win rate by lane role</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="py-6 text-center text-muted-foreground">
            No parsed matches with lane data.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 56 }}
              barCategoryGap={12}
            >
              <XAxis type="number" dataKey="games" hide />
              <YAxis
                type="category"
                dataKey="role"
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={({ active, payload }) => {
                  const row = payload?.[0]?.payload as LaneRow | undefined;
                  if (!active || !row) return null;
                  return (
                    <ChartTooltipCard
                      title={row.role}
                      rows={[
                        { label: "Games", value: row.games.toLocaleString() },
                        { label: "Wins", value: row.win.toLocaleString() },
                        { label: "Win rate", value: formatPercent(row.rate) },
                      ]}
                    />
                  );
                }}
              />
              <Bar dataKey="games" fill="var(--color-games)" radius={4}>
                <LabelList
                  dataKey="rate"
                  position="right"
                  className="fill-muted-foreground tabular-nums"
                  formatter={(rate) =>
                    typeof rate === "number" ? `${rate.toFixed(0)}% WR` : ""
                  }
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
