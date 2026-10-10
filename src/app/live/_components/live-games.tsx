"use client";

import { useState } from "react";
import { LiveGameCard } from "@/components/live-game-card";
import { PageHeader } from "@/components/page-header";
import { QueryError } from "@/components/query-error";
import { Stagger, StaggerItem } from "@/components/stagger";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useHeroes, useLiveGames } from "@/lib/api/hooks";
import { sortLiveGames } from "@/lib/live";

export function LiveGames() {
  const live = useLiveGames();
  const heroes = useHeroes();
  const [scope, setScope] = useState<"all" | "league">("all");

  const games = sortLiveGames(live.games).filter(
    (game) => scope === "all" || game.league_id,
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Stagger className="space-y-8">
        <StaggerItem>
          <PageHeader
            eyebrow="Live · updates every 30 seconds"
            title="Live games"
            description="High-MMR and league games in progress"
          />
        </StaggerItem>
        <StaggerItem>
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[scope]}
            onValueChange={(value) => {
              if (value[0] === "all" || value[0] === "league")
                setScope(value[0]);
            }}
            aria-label="Games to show"
          >
            <ToggleGroupItem value="all">All games</ToggleGroupItem>
            <ToggleGroupItem value="league">League only</ToggleGroupItem>
          </ToggleGroup>
        </StaggerItem>
      </Stagger>
      <div className="mt-6">
        {live.isError ? (
          <QueryError message="Couldn't load live games." queries={[live]} />
        ) : live.isLoading ? (
          <div className="h-96 rounded-sm hud-skeleton" />
        ) : games.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            No games in progress right now.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {games.map((game) => (
              <LiveGameCard
                key={game.match_id}
                game={game}
                heroes={heroes.heroes}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
