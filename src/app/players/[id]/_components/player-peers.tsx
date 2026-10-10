"use client";

import Image from "next/image";
import { PlayerLink } from "@/components/entity-link";
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
import { usePlayerPeers, usePlayerPros } from "@/lib/api/hooks";
import type { PlayerPeer, PlayerPro } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { formatPercent, winRate } from "@/lib/dota";
import { cn } from "@/lib/utils";
import { usePlayerFilters } from "../_hooks/use-player-filters";
import { PlayerTabSkeleton } from "./player-skeleton";

// Pros the player has met at least once; the endpoint returns every pro
const hasPlayed = (row: { with_games: number; against_games: number }) =>
  row.with_games + row.against_games > 0;

function PersonCell({
  accountId,
  name,
  avatar,
  subtitle,
}: {
  accountId: number;
  name: string;
  avatar?: string | null;
  subtitle?: string | null;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {avatar ? (
        <Image
          src={avatar}
          alt=""
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-[2px] ring-1 ring-frame"
        />
      ) : (
        <div className="size-8 shrink-0 rounded-[2px] bg-muted ring-1 ring-frame" />
      )}
      <div className="min-w-0">
        <PlayerLink
          id={accountId}
          className="block max-w-48 truncate font-medium"
        >
          {name}
        </PlayerLink>
        {subtitle && (
          <span className="block max-w-48 truncate text-xs text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

function RateCell({ win, games }: { win: number; games: number }) {
  if (games === 0) return <span className="text-muted-foreground">—</span>;
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

const sharedColumns = <T extends PlayerPeer | PlayerPro>(): Column<T>[] => [
  {
    key: "with",
    header: "With",
    cell: (row) => <RateCell win={row.with_win} games={row.with_games} />,
    sortValue: (row) => row.with_games,
  },
  {
    key: "against",
    header: "Against",
    cell: (row) => <RateCell win={row.against_win} games={row.against_games} />,
    sortValue: (row) => row.against_games,
  },
  {
    key: "last",
    header: "Last played",
    cell: (row) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.last_played ? dayjs.unix(row.last_played).fromNow() : "—"}
      </span>
    ),
    sortValue: (row) => row.last_played ?? 0,
    className: "hidden pr-(--card-spacing) md:table-cell",
  },
];

const peerColumns: Column<PlayerPeer>[] = [
  {
    key: "player",
    header: "Player",
    cell: (row) => (
      <PersonCell
        accountId={row.account_id}
        name={row.personaname || "Anonymous"}
        avatar={row.avatarfull}
        subtitle={row.name}
      />
    ),
    sortValue: (row) => (row.personaname ?? "").toLowerCase(),
    className: "pl-(--card-spacing)",
  },
  ...sharedColumns<PlayerPeer>(),
];

const proColumns: Column<PlayerPro>[] = [
  {
    key: "player",
    header: "Pro",
    cell: (row) => (
      <PersonCell
        accountId={row.account_id}
        name={row.name || row.personaname || "Unknown"}
        avatar={row.avatarfull}
        subtitle={row.team_name?.trim()}
      />
    ),
    sortValue: (row) => (row.name ?? "").toLowerCase(),
    className: "pl-(--card-spacing)",
  },
  ...sharedColumns<PlayerPro>(),
];

export function PlayerPeers({ accountId }: { accountId: string }) {
  const { filters } = usePlayerFilters();
  const peers = usePlayerPeers(accountId, filters);
  const pros = usePlayerPros(accountId, filters);

  const queries = [peers, pros];

  if (queries.some((query) => query.isError)) {
    return <QueryError message="Couldn't load peers." queries={queries} />;
  }

  if (queries.some((query) => query.isLoading)) return <PlayerTabSkeleton />;

  const sections = [
    {
      title: "Played with",
      description: "Players who shared a lobby, by games together",
      empty: "No peers for these filters.",
      table: (
        <SortableTable
          rows={peers.peers}
          columns={peerColumns}
          rowKey={(row) => row.account_id}
          defaultSort="with"
        />
      ),
      count: peers.peers.length,
      isPlaceholder: peers.isPlaceholderData,
    },
    {
      title: "Pros played",
      description: "Professional players met as teammates or opponents",
      empty: "No pro players for these filters.",
      table: (
        <SortableTable
          rows={pros.pros.filter(hasPlayed)}
          columns={proColumns}
          rowKey={(row) => row.account_id}
          defaultSort="with"
        />
      ),
      count: pros.pros.filter(hasPlayed).length,
      isPlaceholder: pros.isPlaceholderData,
    },
  ];

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent
            className={cn(
              "px-0 transition-opacity",
              section.isPlaceholder && "opacity-60",
            )}
          >
            {section.count === 0 ? (
              <p className="py-6 text-center text-muted-foreground">
                {section.empty}
              </p>
            ) : (
              section.table
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
