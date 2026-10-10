"use client";

import Image from "next/image";
import { PlayerLink } from "@/components/entity-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHeroRankings } from "@/lib/api/hooks";
import { getRankLabel } from "@/lib/rank";
import { tabPlaceholder } from "./tab-placeholder";

const SHOWN_PLAYERS = 50;

export function HeroPlayers({ heroId }: { heroId: string }) {
  const rankings = useHeroRankings(heroId);

  const placeholder = tabPlaceholder([rankings], "Couldn't load top players.");
  if (placeholder) return placeholder;

  const players = rankings.rankings.slice(0, SHOWN_PLAYERS);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top players</CardTitle>
        <CardDescription>
          Highest hero scores, from recent ranked performance on this hero
        </CardDescription>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No ranked players yet.
          </p>
        ) : (
          <ol className="grid gap-2 sm:grid-cols-2">
            {players.map((player, index) => (
              <li
                key={player.account_id}
                className="flex items-center gap-3 rounded-sm border border-frame bg-muted/30 px-3 py-2"
              >
                <span className="w-6 shrink-0 text-right font-heading font-bold text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                {player.avatar ? (
                  <Image
                    src={player.avatar}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 shrink-0 rounded-[2px] ring-1 ring-frame"
                  />
                ) : (
                  <div className="size-8 shrink-0 rounded-[2px] bg-muted ring-1 ring-frame" />
                )}
                <div className="min-w-0 flex-1">
                  <PlayerLink
                    id={player.account_id}
                    className="block truncate font-medium"
                  >
                    {player.name || player.personaname || "Anonymous"}
                  </PlayerLink>
                  <span className="block text-xs text-muted-foreground">
                    {getRankLabel(player.rank_tier ?? null)}
                  </span>
                </div>
                <span className="shrink-0 text-sm text-gold tabular-nums">
                  {Math.round(player.score).toLocaleString()}
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
