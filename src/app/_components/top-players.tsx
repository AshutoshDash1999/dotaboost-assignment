"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { staggerContainer, staggerItem } from "@/components/stagger";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTopPlayers } from "@/lib/api/hooks";
import { PlayerCard, PlayerCardSkeleton } from "./player-card";

const HOME_LIMIT = 10;
const SKELETON_KEYS = Array.from(
  { length: HOME_LIMIT },
  (_, i) => `skeleton-${i}`,
);

export function TopPlayers() {
  const [turbo, setTurbo] = useState(false);

  return (
    <section>
      <SectionHeading
        title="Leaderboard"
        className="mb-5"
        aside={
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[turbo ? "turbo" : "ranked"]}
            onValueChange={(value) => {
              if (value[0]) setTurbo(value[0] === "turbo");
            }}
            aria-label="Leaderboard mode"
          >
            <ToggleGroupItem value="ranked">Ranked</ToggleGroupItem>
            <ToggleGroupItem value="turbo">Turbo</ToggleGroupItem>
          </ToggleGroup>
        }
      />
      <Leaderboard turbo={turbo} />
    </section>
  );
}

function Leaderboard({ turbo }: { turbo: boolean }) {
  const { topPlayers, isLoadingTopPlayers, isError, refetch } =
    useTopPlayers(turbo);

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
          <PlayerCard
            player={player}
            position={index + 1}
            ratingLabel={turbo ? "Turbo rating" : "MMR"}
          />
        </motion.li>
      ))}
    </motion.ol>
  );
}
