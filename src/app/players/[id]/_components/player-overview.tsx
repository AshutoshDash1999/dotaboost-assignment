"use client";

import { motion } from "motion/react";
import { QueryError } from "@/components/query-error";
import { StaggerItem, staggerContainer } from "@/components/stagger";
import {
  useHeroes,
  usePlayerCounts,
  usePlayerHeroes,
  usePlayerLookup,
  usePlayerRecentMatches,
  usePlayerTotals,
  usePlayerWinLoss,
} from "@/lib/api/hooks";
import { AverageStats } from "./average-stats";
import { LaneRoles } from "./lane-roles";
import { PerformanceTrend } from "./performance-trend";
import { PlayerOverviewSkeleton } from "./player-skeleton";
import { PlayerStats } from "./player-stats";
import { RecentMatches } from "./recent-matches";
import { StatDistribution } from "./stat-distribution";
import { TopHeroes } from "./top-heroes";

const RECENT_MATCHES = 5;
const RECENT_WL_LIMIT = 20;
const TOP_HEROES = 10;

export function PlayerOverview({ accountId }: { accountId: string }) {
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

  if (queries.some((query) => query.isError)) {
    return (
      <QueryError message="Couldn't load this player." queries={queries} />
    );
  }

  const player = lookup.player;
  if (!player || queries.some((query) => query.isLoading)) {
    return <PlayerOverviewSkeleton />;
  }

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
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
    </motion.div>
  );
}
