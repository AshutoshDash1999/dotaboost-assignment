"use client";

import { IconArrowLeft, IconLoader2, IconRefresh } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { routes } from "@/components/entity-link";
import { isNotFound, QueryError } from "@/components/query-error";
import { Stagger, StaggerItem } from "@/components/stagger";
import { TabNav } from "@/components/tab-nav";
import { Button } from "@/components/ui/button";
import { usePlayerLookup, useRefreshPlayer } from "@/lib/api/hooks";
import { usePlayerFilters } from "../_hooks/use-player-filters";
import { PlayerFilters } from "./player-filters";
import { PlayerHeader } from "./player-header";
import { PlayerNotFound } from "./player-not-found";
import { PlayerHeaderSkeleton } from "./player-skeleton";

const TABS = [
  { label: "Overview", path: "", filterable: true },
  { label: "Matches", path: "/matches", filterable: true },
  { label: "Heroes", path: "/heroes", filterable: true },
  { label: "Peers", path: "/peers", filterable: true },
  { label: "Rankings", path: "/rankings", filterable: false },
  { label: "Activity", path: "/activity", filterable: true },
];

// Header and tabs stay mounted while the tab content below changes
export function PlayerShell({
  accountId,
  children,
}: {
  accountId: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const lookup = usePlayerLookup(accountId);
  const refresh = useRefreshPlayer(accountId);
  const { queryString } = usePlayerFilters();

  const base = routes.player(accountId);
  const current = TABS.find((tab) => pathname === base + tab.path);
  const suffix = queryString ? `?${queryString}` : "";
  const tabs = TABS.map((tab) => ({
    label: tab.label,
    href: base + tab.path + suffix,
  }));

  if (isNotFound(lookup.error)) return <PlayerNotFound />;

  if (lookup.isError) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
        <QueryError message="Couldn't load this player." queries={[lookup]} />
      </main>
    );
  }

  const name = lookup.player?.profile?.personaname;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6">
      <title>{name ? `${name} · Dota stats` : "Dota stats"}</title>
      <Stagger className="space-y-8">
        <StaggerItem className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <IconArrowLeft />
            Top players
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={refresh.isPending}
            onClick={() => refresh.mutate()}
            title="Ask OpenDota to re-fetch this player's match history"
          >
            {refresh.isPending ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              <IconRefresh />
            )}
            {refresh.isSuccess ? "Refresh queued" : "Refresh data"}
          </Button>
        </StaggerItem>
        <StaggerItem className="space-y-4">
          {lookup.player ? (
            <PlayerHeader player={lookup.player} />
          ) : (
            <PlayerHeaderSkeleton />
          )}
          <TabNav items={tabs} />
          {current?.filterable && <PlayerFilters />}
        </StaggerItem>
      </Stagger>
      {children}
    </main>
  );
}
