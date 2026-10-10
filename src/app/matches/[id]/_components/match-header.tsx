import Image from "next/image";
import { Fragment } from "react";
import { LeagueLink, TeamLink } from "@/components/entity-link";
import type { Match, MatchTeam, NamedConstant } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { formatConstantName, formatDuration } from "@/lib/dota";
import { cn } from "@/lib/utils";

function TeamName({
  team,
  fallback,
  won,
  align,
}: {
  team: MatchTeam | null | undefined;
  fallback: string;
  won: boolean;
  align: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-3",
        align === "end" && "flex-row-reverse text-right",
      )}
    >
      {team?.logo_url && (
        <Image
          src={team.logo_url}
          alt=""
          width={48}
          height={48}
          className="hidden size-12 shrink-0 object-contain sm:block"
        />
      )}
      <div className="min-w-0">
        <p
          className={cn(
            "truncate font-heading text-lg font-bold tracking-wide sm:text-2xl",
            fallback === "Radiant" ? "text-radiant" : "text-dire",
          )}
        >
          {team?.team_id ? (
            <TeamLink id={team.team_id}>{team.name}</TeamLink>
          ) : (
            fallback
          )}
        </p>
        {won && (
          <p className="text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
            Victory
          </p>
        )}
      </div>
    </div>
  );
}

export function MatchHeader({
  match,
  gameMode,
}: {
  match: Match;
  gameMode: NamedConstant | undefined;
}) {
  const details = [
    { key: "mode", node: formatConstantName(gameMode?.name, "game_mode_") },
    match.league && {
      key: "league",
      node: (
        <LeagueLink id={match.league.leagueid}>{match.league.name}</LeagueLink>
      ),
    },
    {
      key: "date",
      node: dayjs.unix(match.start_time).format("D MMM YYYY, HH:mm"),
    },
  ].filter((detail) => !!detail);

  return (
    <header className="overflow-hidden hud-panel p-5 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_50%_0%,var(--glow),transparent_70%)] opacity-40"
      />
      <div className="relative">
        <p className="text-center text-[11px] font-semibold tracking-[0.25em] text-muted-foreground uppercase">
          Match {match.match_id}
        </p>
        <div className="mt-4 flex items-center gap-3 sm:gap-6">
          <TeamName
            team={match.radiant_team}
            fallback="Radiant"
            won={match.radiant_win}
            align="start"
          />
          <div className="shrink-0 text-center">
            <p className="font-heading text-3xl font-bold tabular-nums sm:text-5xl">
              <span className="text-radiant">{match.radiant_score}</span>
              <span className="mx-2 text-muted-foreground">:</span>
              <span className="text-dire">{match.dire_score}</span>
            </p>
            <p className="mt-1 font-mono text-sm text-muted-foreground tabular-nums">
              {formatDuration(match.duration)}
            </p>
          </div>
          <TeamName
            team={match.dire_team}
            fallback="Dire"
            won={!match.radiant_win}
            align="end"
          />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {details.map((detail, index) => (
            <Fragment key={detail.key}>
              {index > 0 && " · "}
              {detail.node}
            </Fragment>
          ))}
        </p>
      </div>
    </header>
  );
}
