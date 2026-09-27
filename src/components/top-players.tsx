"use client";

import { motion } from "motion/react";
import { PlayerCard, PlayerCardSkeleton } from "@/components/player-card";
import { staggerContainer, staggerItem } from "@/components/stagger";
import { Button } from "@/components/ui/button";
import { useTopPlayers } from "@/lib/api/hooks";

const HOME_LIMIT = 10;
const SKELETON_KEYS = Array.from(
  { length: HOME_LIMIT },
  (_, i) => `skeleton-${i}`,
);

export function TopPlayers() {
  const { topPlayers, isLoadingTopPlayers, isError, refetch } = useTopPlayers();

  if (isLoadingTopPlayers) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKELETON_KEYS.map((key) => (
          <li key={key}>
            <PlayerCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 hud-panel py-12 text-center">
        <p className="text-muted-foreground">Couldn't load top players.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (topPlayers.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No players found.
      </p>
    );
  }

  return (
    <motion.ol
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {topPlayers.slice(0, HOME_LIMIT).map((player, index) => (
        <motion.li
          key={player.account_id}
          variants={staggerItem}
          whileHover={{ y: -3 }}
        >
          <PlayerCard player={player} position={index + 1} />
        </motion.li>
      ))}
    </motion.ol>
  );
}
