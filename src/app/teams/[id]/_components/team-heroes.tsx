"use client";

import { HeroCell } from "@/components/hero-cell";
import { QueryError } from "@/components/query-error";
import { type Column, SortableTable } from "@/components/sortable-table";
import { winRateColor } from "@/components/stat-tile";
import { Card, CardContent } from "@/components/ui/card";
import { useHeroes, useTeamHeroes } from "@/lib/api/hooks";
import type { HeroConstant, TeamHero } from "@/lib/api/types";
import { formatPercent, winRate } from "@/lib/dota";

const columns = (heroes: Record<string, HeroConstant>): Column<TeamHero>[] => [
  {
    key: "hero",
    header: "Hero",
    cell: (row) => <HeroCell hero={heroes[row.hero_id]} linked />,
    sortValue: (row) => row.localized_name ?? "",
    className: "pl-(--card-spacing)",
  },
  {
    key: "games",
    header: "Games",
    cell: (row) => row.games_played.toLocaleString(),
    sortValue: (row) => row.games_played,
  },
  {
    key: "winrate",
    header: "Win %",
    cell: (row) => {
      const rate = winRate(row.wins, row.games_played);
      return <span className={winRateColor(rate)}>{formatPercent(rate)}</span>;
    },
    sortValue: (row) => winRate(row.wins, row.games_played) ?? -1,
    className: "pr-(--card-spacing)",
  },
];

export function TeamHeroes({ teamId }: { teamId: string }) {
  const query = useTeamHeroes(teamId);
  const heroes = useHeroes();

  if (query.isError || heroes.isError) {
    return (
      <QueryError message="Couldn't load heroes." queries={[query, heroes]} />
    );
  }
  if (query.isLoading || heroes.isLoading) {
    return <div className="h-96 rounded-sm hud-skeleton" />;
  }

  return (
    <Card>
      <CardContent className="px-0">
        {query.heroes.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No heroes recorded.
          </p>
        ) : (
          <SortableTable
            rows={query.heroes}
            columns={columns(heroes.heroes)}
            rowKey={(row) => row.hero_id}
            defaultSort="games"
          />
        )}
      </CardContent>
    </Card>
  );
}
