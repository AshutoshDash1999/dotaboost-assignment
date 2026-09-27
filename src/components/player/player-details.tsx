"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { AverageStats } from "@/components/player/average-stats";
import { LaneRoles } from "@/components/player/lane-roles";
import { PerformanceTrend } from "@/components/player/performance-trend";
import { PlayerHeader } from "@/components/player/player-header";
import { PlayerNotFound } from "@/components/player/player-not-found";
import { PlayerSkeleton } from "@/components/player/player-skeleton";
import { PlayerStats } from "@/components/player/player-stats";
import { RecentMatches } from "@/components/player/recent-matches";
import { StatDistribution } from "@/components/player/stat-distribution";
import { TopHeroes } from "@/components/player/top-heroes";
import { StaggerItem, staggerContainer } from "@/components/stagger";
import { Button } from "@/components/ui/button";
import {
  useHeroes,
  usePlayerCounts,
  usePlayerHeroes,
  usePlayerLookup,
  usePlayerRecentMatches,
  usePlayerTotals,
  usePlayerWinLoss,
} from "@/lib/api/hooks";

const RECENT_MATCHES = 5;
const RECENT_WL_LIMIT = 20;
const TOP_HEROES = 10;

// OpenDota answers 404 for accounts it has never seen
const isNotFound = (error: unknown) =>
  (error as { response?: { status?: number } } | null)?.response?.status ===
  404;

export function PlayerDetails({ accountId }: { accountId: string }) {
  const lookup = usePlayerLookup(accountId);
  const overall = usePlayerWinLoss(accountId);
  const recent = usePlayerWinLoss(accountId, RECENT_WL_LIMIT);
  const matches = usePlayerRecentMatches(accountId);
  const playerHeroes = usePlayerHeroes(accountId);
  const totals = usePlayerTotals(accountId);
  const counts = usePlayerCounts(accountId);
  const heroes = useHeroes();

  const queries = [
    lookup,
    overall,
    recent,
    matches,
    playerHeroes,
    totals,
    counts,
    heroes,
  ];

  if (isNotFound(lookup.error)) return <PlayerNotFound />;

  if (queries.some((query) => query.isError)) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-3 hud-panel px-6 py-10 text-center">
          <p className="text-muted-foreground">Couldn't load this player.</p>
          <Button
            variant="outline"
            onClick={() => {
              for (const query of queries) if (query.isError) query.refetch();
            }}
          >
            Try again
          </Button>
        </div>
      </main>
    );
  }

  const player = lookup.player;
  if (!player || queries.some((query) => query.isLoading)) {
    return <PlayerSkeleton />;
  }

  const name = player.profile?.personaname;

  return (
    <motion.main
      className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <title>{name ? `${name} · Dota stats` : "Dota stats"}</title>
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
      <StaggerItem>
        <PlayerHeader player={player} />
      </StaggerItem>
      <StaggerItem>
        <PlayerStats
          player={player}
          overall={overall.winLoss}
          recent={recent.winLoss}
          recentLimit={RECENT_WL_LIMIT}
        />
      </StaggerItem>
      <StaggerItem>
        <AverageStats totals={totals.totals} />
      </StaggerItem>
      <StaggerItem className="grid gap-8 lg:grid-cols-3">
        <PerformanceTrend
          matches={matches.recentMatches}
          heroes={heroes.heroes}
        />
        <LaneRoles laneRoles={counts.counts?.lane_role} />
      </StaggerItem>
      <StaggerItem>
        <RecentMatches
          matches={matches.recentMatches.slice(0, RECENT_MATCHES)}
          heroes={heroes.heroes}
        />
      </StaggerItem>
      <StaggerItem>
        <TopHeroes
          // Already sorted by games; drop heroes the player never picked
          playerHeroes={playerHeroes.playerHeroes
            .filter((hero) => hero.games > 0)
            .slice(0, TOP_HEROES)}
          heroes={heroes.heroes}
        />
      </StaggerItem>
      <StaggerItem>
        <StatDistribution accountId={accountId} />
      </StaggerItem>
    </motion.main>
  );
}
