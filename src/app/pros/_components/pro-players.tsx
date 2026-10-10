"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayerLink, TeamLink } from "@/components/entity-link";
import { ListSearch } from "@/components/list-search";
import { PageHeader } from "@/components/page-header";
import { QueryError } from "@/components/query-error";
import { ShowMoreButton } from "@/components/show-more-button";
import { Stagger, StaggerItem } from "@/components/stagger";
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
import { useProPlayers } from "@/lib/api/hooks";
import { dayjs } from "@/lib/dayjs";

const ROLES: Record<number, string> = { 1: "Core", 2: "Support" };

export function ProPlayers() {
  const proPlayers = useProPlayers();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  // Most recently active first, so current pros lead the list
  const players = proPlayers.proPlayers
    .filter(
      (player) =>
        !needle ||
        player.name?.toLowerCase().includes(needle) ||
        player.team_name?.toLowerCase().includes(needle),
    )
    .sort((a, b) =>
      (b.last_match_time ?? "").localeCompare(a.last_match_time ?? ""),
    );
  const list = useShowMore(players);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Stagger className="space-y-8">
        <StaggerItem>
          <PageHeader
            eyebrow="Pro scene · OpenDota"
            title="Pro players"
            description="Professional players, most recently active first"
          />
        </StaggerItem>
        <StaggerItem>
          <ListSearch
            value={query}
            onChange={(value) => {
              setQuery(value);
              list.reset();
            }}
            placeholder="Search by player or team"
          />
        </StaggerItem>
      </Stagger>
      <div className="mt-6">
        {proPlayers.isError ? (
          <QueryError
            message="Couldn't load pro players."
            queries={[proPlayers]}
          />
        ) : proPlayers.isLoading ? (
          <div className="h-96 rounded-sm hud-skeleton" />
        ) : (
          <Card>
            <CardContent className="px-0">
              {players.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">
                  No players match “{query}”.
                </p>
              ) : (
                <Table>
                  <TableHeader className="text-[11px] tracking-wider uppercase">
                    <TableRow className="border-frame hover:bg-transparent">
                      <TableHead className="pl-(--card-spacing)">
                        Player
                      </TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Role
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Country
                      </TableHead>
                      <TableHead className="pr-(--card-spacing)">
                        Last match
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.visible.map((player) => (
                      <TableRow key={player.account_id}>
                        <TableCell className="pl-(--card-spacing)">
                          <div className="flex items-center gap-2.5">
                            {player.avatarfull ? (
                              <Image
                                src={player.avatarfull}
                                alt=""
                                width={28}
                                height={28}
                                className="size-7 shrink-0 rounded-[2px] ring-1 ring-frame"
                              />
                            ) : (
                              <div className="size-7 shrink-0 rounded-[2px] bg-muted ring-1 ring-frame" />
                            )}
                            <PlayerLink
                              id={player.account_id}
                              className="max-w-40 truncate font-medium"
                            >
                              {player.name}
                            </PlayerLink>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-48">
                          {player.team_id && player.team_name ? (
                            <TeamLink
                              id={player.team_id}
                              className="block truncate text-muted-foreground"
                            >
                              {player.team_name}
                            </TeamLink>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {ROLES[player.fantasy_role ?? 0] ?? "—"}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground uppercase md:table-cell">
                          {player.country_code || "—"}
                        </TableCell>
                        <TableCell className="pr-(--card-spacing) whitespace-nowrap text-muted-foreground">
                          {player.last_match_time
                            ? dayjs(player.last_match_time).fromNow()
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
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
