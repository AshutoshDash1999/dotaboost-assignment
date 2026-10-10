"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHeroBenchmarks } from "@/lib/api/hooks";
import { tabPlaceholder } from "./tab-placeholder";

// A readable subset of the 11 percentiles the endpoint returns
const SHOWN_PERCENTILES = [0.1, 0.3, 0.5, 0.7, 0.9, 0.99];

const METRICS: { key: string; label: string; decimals: number }[] = [
  { key: "gold_per_min", label: "Gold / min", decimals: 0 },
  { key: "xp_per_min", label: "XP / min", decimals: 0 },
  { key: "last_hits_per_min", label: "Last hits / min", decimals: 1 },
  { key: "hero_damage_per_min", label: "Hero damage / min", decimals: 0 },
  { key: "hero_healing_per_min", label: "Healing / min", decimals: 0 },
  { key: "kills_per_min", label: "Kills / min", decimals: 2 },
  { key: "deaths_per_min", label: "Deaths / min", decimals: 2 },
  { key: "assists_per_min", label: "Assists / min", decimals: 2 },
  { key: "tower_damage", label: "Tower damage", decimals: 0 },
];

export function HeroBenchmarks({ heroId }: { heroId: string }) {
  const benchmarks = useHeroBenchmarks(heroId);

  const placeholder = tabPlaceholder([benchmarks], "Couldn't load benchmarks.");
  if (placeholder) return placeholder;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benchmarks</CardTitle>
        <CardDescription>
          The value a player needs to beat that share of players on this hero.
          For deaths, lower is better.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table className="tabular-nums">
          <TableHeader className="text-[11px] tracking-wider uppercase">
            <TableRow className="border-frame hover:bg-transparent">
              <TableHead className="pl-(--card-spacing)">Stat</TableHead>
              {SHOWN_PERCENTILES.map((percentile, index) => (
                <TableHead
                  key={percentile}
                  className={
                    index === SHOWN_PERCENTILES.length - 1
                      ? "pr-(--card-spacing) text-right"
                      : "text-right"
                  }
                >
                  {Math.round(percentile * 100)}%
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {METRICS.map((metric) => {
              const points = benchmarks.benchmarks?.[metric.key] ?? [];
              return (
                <TableRow key={metric.key}>
                  <TableCell className="pl-(--card-spacing) font-medium">
                    {metric.label}
                  </TableCell>
                  {SHOWN_PERCENTILES.map((percentile, index) => {
                    const point = points.find(
                      (p) => Math.abs(p.percentile - percentile) < 0.001,
                    );
                    return (
                      <TableCell
                        key={percentile}
                        className={
                          index === SHOWN_PERCENTILES.length - 1
                            ? "pr-(--card-spacing) text-right text-gold"
                            : "text-right"
                        }
                      >
                        {point
                          ? point.value.toLocaleString(undefined, {
                              maximumFractionDigits: metric.decimals,
                              minimumFractionDigits: metric.decimals,
                            })
                          : "—"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
