"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  type BarShapeProps,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltipCard } from "@/components/player/chart-tooltip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayerHistogram } from "@/lib/api/hooks";
import type { HistogramBin } from "@/lib/api/types";
import { formatCompact, formatPercent, winRate } from "@/lib/dota";

const FIELDS = [
  { key: "kills", label: "Kills", format: String },
  { key: "deaths", label: "Deaths", format: String },
  { key: "assists", label: "Assists", format: String },
  { key: "gold_per_min", label: "GPM", format: String },
  { key: "xp_per_min", label: "XPM", format: String },
  { key: "last_hits", label: "Last hits", format: String },
  { key: "hero_damage", label: "Hero damage", format: formatCompact },
  // Duration bins are in seconds
  {
    key: "duration",
    label: "Duration",
    format: (seconds: number) => `${Math.round(seconds / 60)}m`,
  },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

const chartConfig = {
  win: { label: "Wins", color: "var(--chart-win)" },
  loss: { label: "Losses", color: "var(--chart-loss)" },
} satisfies ChartConfig;

type BinRow = { x: number; label: string; win: number; loss: number };

const BAR_RADIUS = 4;

// Round the outer ends of each stack, whichever segment ends up there
function stackedBar(segment: "win" | "loss") {
  return function StackedBar(props: BarShapeProps) {
    const row = props.payload as BinRow;
    const top = segment === "loss" || row.loss === 0 ? BAR_RADIUS : 0;
    const bottom = segment === "win" || row.win === 0 ? BAR_RADIUS : 0;
    return <Rectangle {...props} radius={[top, top, bottom, bottom]} />;
  };
}

const winBar = stackedBar("win");
const lossBar = stackedBar("loss");

// Drop the empty bins at either end so the chart centres on real games
function trimEmpty(bins: HistogramBin[]) {
  const first = bins.findIndex((bin) => bin.games > 0);
  if (first === -1) return [];
  const last = bins.findLastIndex((bin) => bin.games > 0);
  return bins.slice(first, last + 1);
}

export function StatDistribution({ accountId }: { accountId: string }) {
  const [fieldKey, setFieldKey] = useState<FieldKey>("kills");
  const field = FIELDS.find((f) => f.key === fieldKey) ?? FIELDS[0];
  const { bins, isLoading, isError, isPlaceholderData, refetch } =
    usePlayerHistogram(accountId, fieldKey);

  const step = bins.length > 1 ? bins[1].x - bins[0].x : 1;
  const data: BinRow[] = trimEmpty(bins).map((bin) => ({
    x: bin.x,
    // Unit-width bins (kills, deaths…) hold a single value, not a range
    label:
      step === 1
        ? field.format(bin.x)
        : `${field.format(bin.x)}–${field.format(bin.x + step)}`,
    win: bin.win,
    loss: bin.games - bin.win,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution</CardTitle>
        <CardDescription>
          How often each {field.label.toLowerCase()} value comes up, split by
          result
        </CardDescription>
        <CardAction className="max-w-full min-w-0 max-sm:col-span-full max-sm:col-start-1 max-sm:row-start-3 max-sm:justify-self-start">
          <Tabs
            value={fieldKey}
            onValueChange={(value) => setFieldKey(value as FieldKey)}
          >
            <TabsList className="max-w-full justify-start overflow-x-auto">
              {FIELDS.map((f) => (
                <TabsTrigger key={f.key} value={f.key} className="flex-none">
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-muted-foreground">
              Couldn't load this distribution.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="h-72 animate-pulse rounded-lg bg-muted" />
        ) : data.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No matches recorded this stat.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-72 transition-opacity data-[stale=true]:opacity-50"
            data-stale={isPlaceholderData}
          >
            <BarChart data={data} margin={{ top: 8, right: 8, left: -8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="x"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                tickFormatter={(x: number) => field.format(x)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={48}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={({ active, payload }) => {
                  const row = payload?.[0]?.payload as BinRow | undefined;
                  if (!active || !row) return null;
                  const games = row.win + row.loss;
                  return (
                    <ChartTooltipCard
                      title={`${field.label}: ${row.label}`}
                      rows={[
                        {
                          label: "Wins",
                          value: row.win.toLocaleString(),
                          color: "var(--color-win)",
                        },
                        {
                          label: "Losses",
                          value: row.loss.toLocaleString(),
                          color: "var(--color-loss)",
                        },
                        {
                          label: "Win rate",
                          value: formatPercent(winRate(row.win, games)),
                        },
                      ]}
                    />
                  );
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="win"
                stackId="result"
                fill="var(--color-win)"
                stroke="var(--card)"
                strokeWidth={1}
                shape={winBar}
              />
              <Bar
                dataKey="loss"
                stackId="result"
                fill="var(--color-loss)"
                stroke="var(--card)"
                strokeWidth={1}
                shape={lossBar}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
