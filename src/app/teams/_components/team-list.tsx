"use client";

import { useState } from "react";
import { TeamLink } from "@/components/entity-link";
import { ListSearch } from "@/components/list-search";
import { PageHeader } from "@/components/page-header";
import { QueryError } from "@/components/query-error";
import { ShowMoreButton } from "@/components/show-more-button";
import { Stagger, StaggerItem } from "@/components/stagger";
import { winRateColor } from "@/components/stat-tile";
import { TeamLogo } from "@/components/team-logo";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShowMore } from "@/hooks/use-show-more";
import { useTeams } from "@/lib/api/hooks";
import { dayjs } from "@/lib/dayjs";
import { formatPercent, winRate } from "@/lib/dota";

export function TeamList() {
  const teams = useTeams();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  // Keep the rating rank even when searching
  const ranked = teams.teams.map((team, index) => ({ team, rank: index + 1 }));
  const filtered = ranked.filter(
    ({ team }) =>
      !needle ||
      team.name?.toLowerCase().includes(needle) ||
      team.tag?.toLowerCase().includes(needle),
  );
  const list = useShowMore(filtered);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Stagger className="space-y-8">
        <StaggerItem>
          <PageHeader
            eyebrow="Pro scene · OpenDota"
            title="Teams"
            description="Professional teams ranked by rating"
          />
        </StaggerItem>
        <StaggerItem>
          <ListSearch
            value={query}
            onChange={(value) => {
              setQuery(value);
              list.reset();
            }}
            placeholder="Search by name or tag"
          />
        </StaggerItem>
      </Stagger>
      <div className="mt-6">
        {teams.isError ? (
          <QueryError message="Couldn't load teams." queries={[teams]} />
        ) : teams.isLoading ? (
          <div className="h-96 rounded-sm hud-skeleton" />
        ) : (
          <Card>
            <CardContent className="px-0">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">
                  No teams match “{query}”.
                </p>
              ) : (
                <Table className="tabular-nums">
                  <TableHeader className="text-[11px] tracking-wider uppercase">
                    <TableRow className="border-frame hover:bg-transparent">
                      <TableHead className="w-12 pl-(--card-spacing)">
                        #
                      </TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        W / L
                      </TableHead>
                      <TableHead>Win %</TableHead>
                      <TableHead className="hidden pr-(--card-spacing) md:table-cell">
                        Last match
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.visible.map(({ team, rank }) => {
                      const rate = winRate(team.wins, team.wins + team.losses);
                      return (
                        <TableRow key={team.team_id}>
                          <TableCell className="pl-(--card-spacing) font-heading font-bold text-muted-foreground">
                            {rank}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <TeamLogo url={team.logo_url} size={28} />
                              <TeamLink
                                id={team.team_id}
                                className="max-w-48 truncate font-medium"
                              >
                                {team.name || `Team ${team.team_id}`}
                              </TeamLink>
                            </div>
                          </TableCell>
                          <TableCell className="text-gold">
                            {team.rating ? Math.round(team.rating) : "—"}
                          </TableCell>
                          <TableCell className="hidden whitespace-nowrap sm:table-cell">
                            {team.wins} / {team.losses}
                          </TableCell>
                          <TableCell className={winRateColor(rate)}>
                            {formatPercent(rate)}
                          </TableCell>
                          <TableCell className="hidden pr-(--card-spacing) whitespace-nowrap text-muted-foreground md:table-cell">
                            {team.last_match_time
                              ? dayjs.unix(team.last_match_time).fromNow()
                              : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
              {list.hasMore && (
                <ShowMoreButton
                  remaining={list.remaining}
                  onClick={list.showMore}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
