"use client";

import { HeroCell } from "@/components/hero-cell";
import { type Column, SortableTable } from "@/components/sortable-table";
import { winRateColor } from "@/components/stat-tile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHeroes, useHeroMatchups } from "@/lib/api/hooks";
import type { HeroConstant, HeroMatchup } from "@/lib/api/types";
import { formatPercent, winRate } from "@/lib/dota";
import { tabPlaceholder } from "./tab-placeholder";

// Below this the win rate swings too much to mean anything
const MIN_GAMES = 10;

const columns = (
  heroes: Record<string, HeroConstant>,
): Column<HeroMatchup>[] => [
  {
    key: "hero",
    header: "Against",
    cell: (row) => <HeroCell hero={heroes[row.hero_id]} linked />,
    sortValue: (row) => heroes[row.hero_id]?.localized_name ?? "",
    className: "pl-(--card-spacing)",
  },
  {
    key: "winrate",
    header: "Win %",
    cell: (row) => {
      const rate = winRate(row.wins, row.games_played);
      return <span className={winRateColor(rate)}>{formatPercent(rate)}</span>;
    },
    sortValue: (row) => winRate(row.wins, row.games_played) ?? -1,
  },
  {
    key: "games",
    header: "Games",
    cell: (row) => row.games_played.toLocaleString(),
    sortValue: (row) => row.games_played,
    className: "pr-(--card-spacing)",
  },
];

export function HeroMatchups({ heroId }: { heroId: string }) {
  const matchups = useHeroMatchups(heroId);
  const heroes = useHeroes();

  const placeholder = tabPlaceholder(
    [matchups, heroes],
    "Couldn't load matchups.",
  );
  if (placeholder) return placeholder;

  const rows = matchups.matchups.filter((row) => row.games_played >= MIN_GAMES);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matchups</CardTitle>
        <CardDescription>
          Win rate against each enemy hero, with at least {MIN_GAMES} games.
          Sort by win % to find counters.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {rows.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            Not enough matches yet.
          </p>
        ) : (
          <SortableTable
            rows={rows}
            columns={columns(heroes.heroes)}
            rowKey={(row) => row.hero_id}
            defaultSort="games"
          />
        )}
      </CardContent>
    </Card>
  );
}
