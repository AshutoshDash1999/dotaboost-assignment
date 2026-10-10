"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import type { Match } from "@/lib/api/types";
import { formatCompact } from "@/lib/dota";

const chartConfig = {
  advantage: { label: "Advantage", color: "var(--radiant)" },
} satisfies ChartConfig;

type AdvantagePoint = { minute: number; advantage: number };

function AdvantageChart({
  title,
  values,
  radiantName,
  direName,
}: {
  title: string;
  values: number[];
  radiantName: string;
  direName: string;
}) {
  // useId output can contain characters that break url(#id) references
  const gradientId = `advantage-${useId().replace(/[^\w-]/g, "")}`;
  const data: AdvantagePoint[] = values.map((advantage, minute) => ({
    minute,
    advantage,
  }));

  // Where zero sits in the gradient, so Radiant leads are green and Dire red
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const zeroOffset = max === min ? 0.5 : max / (max - min);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Above zero: {radiantName} ahead · below: {direName} ahead
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-64">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -4 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset={zeroOffset} stopColor="var(--radiant)" />
                <stop offset={zeroOffset} stopColor="var(--dire)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="minute"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={(minute: number) => `${minute}m`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={52}
              tickFormatter={(value: number) => formatCompact(value)}
            />
            <ReferenceLine y={0} stroke="var(--border)" />
            <ChartTooltip
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as
                  | AdvantagePoint
                  | undefined;
                if (!active || !point) return null;
                const leader = point.advantage >= 0 ? radiantName : direName;
                return (
                  <ChartTooltipCard
                    title={`${point.minute}:00`}
                    rows={[
                      {
                        label: leader,
                        value: formatCompact(Math.abs(point.advantage)),
                        color:
                          point.advantage >= 0
                            ? "var(--radiant)"
                            : "var(--dire)",
                      },
                    ]}
                  />
                );
              }}
            />
            <Area
              dataKey="advantage"
              type="monotone"
              stroke={`url(#${gradientId})`}
              fill={`url(#${gradientId})`}
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function MatchGraphs({ match }: { match: Match }) {
  const radiantName = match.radiant_team?.name ?? "Radiant";
  const direName = match.dire_team?.name ?? "Dire";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {match.radiant_gold_adv?.length ? (
        <AdvantageChart
          title="Gold advantage"
          values={match.radiant_gold_adv}
          radiantName={radiantName}
          direName={direName}
        />
      ) : null}
      {match.radiant_xp_adv?.length ? (
        <AdvantageChart
          title="Experience advantage"
          values={match.radiant_xp_adv}
          radiantName={radiantName}
          direName={direName}
        />
      ) : null}
    </div>
  );
}
