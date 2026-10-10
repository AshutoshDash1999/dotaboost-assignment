"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/components/entity-link";
import { isNotFound, QueryError } from "@/components/query-error";
import { Stagger, StaggerItem } from "@/components/stagger";
import { TabNav } from "@/components/tab-nav";
import { Button } from "@/components/ui/button";
import { usePlayerLookup } from "@/lib/api/hooks";
import { PlayerHeader } from "./player-header";
import { PlayerNotFound } from "./player-not-found";
import { PlayerHeaderSkeleton } from "./player-skeleton";

// Header and tabs stay mounted while the tab content below changes
export function PlayerShell({
  accountId,
  children,
}: {
  accountId: string;
  children: ReactNode;
}) {
  const lookup = usePlayerLookup(accountId);
  const base = routes.player(accountId);
  const tabs = [{ label: "Overview", href: base }];

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
        <StaggerItem>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <IconArrowLeft />
            Top players
          </Button>
        </StaggerItem>
        <StaggerItem className="space-y-4">
          {lookup.player ? (
            <PlayerHeader player={lookup.player} />
          ) : (
            <PlayerHeaderSkeleton />
          )}
          <TabNav items={tabs} />
        </StaggerItem>
      </Stagger>
      {children}
    </main>
  );
}
