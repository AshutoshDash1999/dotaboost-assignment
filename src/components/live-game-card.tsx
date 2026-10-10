import { IconEye } from "@tabler/icons-react";
import Image from "next/image";
import { LeagueLink, PlayerLink, TeamLink } from "@/components/entity-link";
import { Card, CardContent } from "@/components/ui/card";
import type { HeroConstant, LiveGame, LivePlayer } from "@/lib/api/types";
import { formatCompact, formatDuration, heroImageUrl } from "@/lib/dota";
import { cn } from "@/lib/utils";

const RADIANT = 0;

function HeroPortrait({ hero }: { hero: HeroConstant | undefined }) {
  // Heroes are 0 until the draft finishes
  if (!hero) return <div className="h-5 w-9 rounded-[2px] bg-muted" />;

  return (
    <Image
      src={heroImageUrl(hero.img)}
      alt={hero.localized_name}
      title={hero.localized_name}
      width={36}
      height={20}
      className="h-5 w-9 rounded-[2px] object-cover ring-1 ring-frame"
    />
  );
}

function Side({
  name,
  teamId,
  players,
  heroes,
  align,
}: {
  name: string;
  teamId?: number;
  players: LivePlayer[];
  heroes: Record<string, HeroConstant>;
  align: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-2",
        align === "end" && "items-end text-right",
      )}
    >
      <div
        className={cn(
          "flex max-w-full items-center gap-2",
          align === "end" && "flex-row-reverse",
        )}
      >
        {teamId ? (
          <TeamLink id={teamId} className="truncate font-semibold">
            {name}
          </TeamLink>
        ) : (
          <span className="truncate font-semibold">{name}</span>
        )}
      </div>
      <div
        className={cn("flex gap-0.5", align === "end" && "flex-row-reverse")}
      >
        {players.map((player) =>
          player.account_id ? (
            <PlayerLink key={player.account_id} id={player.account_id}>
              <HeroPortrait hero={heroes[player.hero_id]} />
            </PlayerLink>
          ) : (
            <HeroPortrait
              key={`${player.team}-${player.hero_id}`}
              hero={heroes[player.hero_id]}
            />
          ),
        )}
      </div>
    </div>
  );
}

export function LiveGameCard({
  game,
  heroes,
}: {
  game: LiveGame;
  heroes: Record<string, HeroConstant>;
}) {
  const radiantAhead = game.radiant_lead >= 0;

  return (
    <Card size="sm">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 animate-pulse rounded-full bg-dire" />
            Live · {formatDuration(Math.max(0, game.game_time))}
          </span>
          {game.league_id ? (
            <LeagueLink id={game.league_id} className="truncate">
              League game
            </LeagueLink>
          ) : game.average_mmr ? (
            <span>Avg MMR {game.average_mmr.toLocaleString()}</span>
          ) : null}
          <span className="flex items-center gap-1 tabular-nums">
            <IconEye className="size-3.5" aria-hidden />
            {formatCompact(game.spectators ?? 0)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Side
            name={game.team_name_radiant || "Radiant"}
            teamId={game.team_id_radiant || undefined}
            players={game.players.filter((p) => p.team === RADIANT)}
            heroes={heroes}
            align="start"
          />
          <div className="shrink-0 text-center">
            <p className="font-heading text-2xl font-bold tabular-nums">
              <span className="text-radiant">{game.radiant_score}</span>
              <span className="mx-1.5 text-muted-foreground">:</span>
              <span className="text-dire">{game.dire_score}</span>
            </p>
            <p
              className={cn(
                "text-[11px] tabular-nums",
                radiantAhead ? "text-radiant" : "text-dire",
              )}
              title="Net worth lead"
            >
              {radiantAhead ? "◀" : ""}{" "}
              {formatCompact(Math.abs(game.radiant_lead))}{" "}
              {radiantAhead ? "" : "▶"}
            </p>
          </div>
          <Side
            name={game.team_name_dire || "Dire"}
            teamId={game.team_id_dire || undefined}
            players={game.players.filter((p) => p.team !== RADIANT)}
            heroes={heroes}
            align="end"
          />
        </div>
      </CardContent>
    </Card>
  );
}
