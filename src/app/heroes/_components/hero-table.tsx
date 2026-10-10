"use client";

import { HeroCell } from "@/components/hero-cell";
import { type Column, SortableTable } from "@/components/sortable-table";
import { winRateColor } from "@/components/stat-tile";
import { Card, CardContent } from "@/components/ui/card";
import type { HeroStats } from "@/lib/api/types";
import { formatPercent } from "@/lib/dota";
import { ATTRIBUTES } from "@/lib/hero-stats";

export interface HeroRow {
  hero: HeroStats;
  picks: number;
  winRate: number | null;
  // Share of matches the hero appears in
  pickRate: number | null;
}

// A bar behind the number makes the column scannable
function RateBar({ value, max }: { value: number | null; max: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:block">
        <div
          className="h-full rounded-full bg-gold/70"
          style={{ width: `${value && max ? (value / max) * 100 : 0}%` }}
        />
      </div>
      <span>{formatPercent(value)}</span>
    </div>
  );
}

export function HeroTable({
  rows,
  showBans,
}: {
  rows: HeroRow[];
  showBans: boolean;
}) {
  const maxPickRate = Math.max(0, ...rows.map((row) => row.pickRate ?? 0));

  const columns: Column<HeroRow>[] = [
    {
      key: "hero",
      header: "Hero",
      cell: (row) => <HeroCell hero={row.hero} linked />,
      sortValue: (row) => row.hero.localized_name,
      className: "pl-(--card-spacing)",
    },
    {
      key: "attr",
      header: "Attribute",
      cell: (row) => (
        <span className="text-muted-foreground">
          {ATTRIBUTES[row.hero.primary_attr] ?? row.hero.primary_attr}
        </span>
      ),
      sortValue: (row) => row.hero.primary_attr,
      className: "hidden md:table-cell",
    },
    {
      key: "winrate",
      header: "Win %",
      cell: (row) => (
        <span className={winRateColor(row.winRate)}>
          {formatPercent(row.winRate)}
        </span>
      ),
      sortValue: (row) => row.winRate ?? -1,
    },
    {
      key: "pickrate",
      header: "Pick %",
      cell: (row) => <RateBar value={row.pickRate} max={maxPickRate} />,
      sortValue: (row) => row.pickRate ?? -1,
    },
    {
      key: "picks",
      header: "Matches",
      cell: (row) => row.picks.toLocaleString(),
      sortValue: (row) => row.picks,
      className: showBans ? undefined : "pr-(--card-spacing)",
    },
    ...(showBans
      ? [
          {
            key: "bans",
            header: "Bans",
            cell: (row: HeroRow) => row.hero.pro_ban.toLocaleString(),
            sortValue: (row: HeroRow) => row.hero.pro_ban,
            className: "pr-(--card-spacing)",
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardContent className="px-0">
        <SortableTable
          rows={rows}
          columns={columns}
          rowKey={(row) => row.hero.id}
          defaultSort="winrate"
        />
      </CardContent>
    </Card>
  );
}
