"use client";

import { HeroCell } from "@/components/hero-cell";
import { QueryError } from "@/components/query-error";
import { type Column, SortableTable } from "@/components/sortable-table";
import { winRateColor } from "@/components/stat-tile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHeroes, usePlayerHeroes } from "@/lib/api/hooks";
import type { HeroConstant, PlayerHero } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { formatPercent, winRate } from "@/lib/dota";
import { cn } from "@/lib/utils";
import { usePlayerFilters } from "../_hooks/use-player-filters";
import { PlayerTabSkeleton } from "./player-skeleton";

function RateCell({ win, games }: { win: number; games: number }) {
  const rate = winRate(win, games);
  return (
    <span className="whitespace-nowrap">
      {games.toLocaleString()}
      <span className={cn("ml-2 text-xs", winRateColor(rate))}>
        {formatPercent(rate)}
      </span>
    </span>
  );
}

const columns = (
  heroes: Record<string, HeroConstant>,
): Column<PlayerHero>[] => [
  {
    key: "hero",
    header: "Hero",
    cell: (row) => <HeroCell hero={heroes[row.hero_id]} />,
    sortValue: (row) => heroes[row.hero_id]?.localized_name ?? "",
    className: "pl-(--card-spacing)",
  },
  {
    key: "games",
    header: "Played",
    cell: (row) => <RateCell win={row.win} games={row.games} />,
    sortValue: (row) => row.games,
  },
  {
    key: "winrate",
    header: "Win %",
    cell: (row) => (
      <span className={winRateColor(winRate(row.win, row.games))}>
        {formatPercent(winRate(row.win, row.games))}
      </span>
    ),
    sortValue: (row) => winRate(row.win, row.games) ?? -1,
  },
  {
    key: "with",
    header: "With",
    cell: (row) => <RateCell win={row.with_win} games={row.with_games} />,
    sortValue: (row) => row.with_games,
    className: "hidden md:table-cell",
  },
  {
    key: "against",
    header: "Against",
    cell: (row) => <RateCell win={row.against_win} games={row.against_games} />,
    sortValue: (row) => row.against_games,
    className: "hidden md:table-cell",
  },
  {
    key: "last",
    header: "Last played",
    cell: (row) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.last_played ? dayjs.unix(row.last_played).fromNow() : "—"}
      </span>
    ),
    sortValue: (row) => row.last_played,
    className: "pr-(--card-spacing)",
  },
];

export function PlayerHeroes({ accountId }: { accountId: string }) {
  const { filters } = usePlayerFilters();
  const playerHeroes = usePlayerHeroes(accountId, filters);
  const heroes = useHeroes();

  const queries = [playerHeroes, heroes];

  if (queries.some((query) => query.isError)) {
    return <QueryError message="Couldn't load heroes." queries={queries} />;
  }

  if (queries.some((query) => query.isLoading)) return <PlayerTabSkeleton />;

  // The endpoint lists every hero; keep the ones this player has touched
  const rows = playerHeroes.playerHeroes.filter(
    (hero) => hero.games + hero.with_games + hero.against_games > 0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heroes</CardTitle>
        <CardDescription>
          Games as, with and against each hero. Click a column to sort.
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          "px-0 transition-opacity",
          playerHeroes.isPlaceholderData && "opacity-60",
        )}
      >
        {rows.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No heroes for these filters.
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
