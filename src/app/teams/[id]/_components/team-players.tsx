"use client";

import { PlayerLink } from "@/components/entity-link";
import { QueryError } from "@/components/query-error";
import { type Column, SortableTable } from "@/components/sortable-table";
import { winRateColor } from "@/components/stat-tile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeamPlayers } from "@/lib/api/hooks";
import type { TeamPlayer } from "@/lib/api/types";
import { formatPercent, winRate } from "@/lib/dota";

const columns: Column<TeamPlayer>[] = [
  {
    key: "player",
    header: "Player",
    cell: (row) => (
      <PlayerLink id={row.account_id} className="font-medium">
        {row.name || `Player ${row.account_id}`}
      </PlayerLink>
    ),
    sortValue: (row) => (row.name ?? "").toLowerCase(),
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

export function TeamPlayers({ teamId }: { teamId: string }) {
  const query = useTeamPlayers(teamId);

  if (query.isError) {
    return <QueryError message="Couldn't load players." queries={[query]} />;
  }
  if (query.isLoading) return <div className="h-96 rounded-sm hud-skeleton" />;

  const groups = [
    {
      title: "Current roster",
      players: query.players.filter((p) => p.is_current_team_member),
    },
    {
      title: "Former players",
      players: query.players.filter(
        (p) => !p.is_current_team_member && p.games_played > 0,
      ),
    },
  ].filter((group) => group.players.length > 0);

  if (groups.length === 0) {
    return (
      <p className="py-6 text-center text-muted-foreground">
        No players recorded.
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {groups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <SortableTable
              rows={group.players}
              columns={columns}
              rowKey={(row) => row.account_id}
              defaultSort="games"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
