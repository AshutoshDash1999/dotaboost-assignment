import Image from "next/image";
import Link from "next/link";
import { RankMedal } from "@/components/rank-medal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TopPlayer } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { getRankLabel } from "@/lib/rank";
import { cn } from "@/lib/utils";

// Gold, silver and bronze for the podium
const PODIUM = [
  "text-gold",
  "text-slate-500 dark:text-slate-300",
  "text-orange-700 dark:text-orange-400",
];

export function PlayerCard({
  player,
  position,
}: {
  player: TopPlayer;
  position: number;
}) {
  const podium = PODIUM[position - 1];

  return (
    <Link
      href={`/players/${player.account_id}`}
      className="block h-full rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Card
        className={cn("glow-hover h-full", position === 1 && "border-gold/60")}
      >
        {position === 1 && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 hud-shine"
          />
        )}
        <CardHeader className="flex items-center gap-3">
          <span
            className={cn(
              "w-8 shrink-0 text-center font-heading text-2xl font-bold tabular-nums",
              podium ?? "text-muted-foreground",
            )}
          >
            {position}
          </span>
          <Image
            src={player.avatarfull}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-sm border border-frame shadow-md"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold">
              {player.personaname || "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground">
              {getRankLabel(player.rank_tier)}
            </p>
          </div>
          <RankMedal rankTier={player.rank_tier} className="size-12" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 border-t border-frame/60 pt-3">
          <div>
            <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              MMR
            </p>
            <p className="font-heading text-lg font-bold text-gold tabular-nums">
              {Math.round(player.computed_mmr).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Last match
            </p>
            <p className="pt-0.5 font-medium">
              {player.last_match_time
                ? dayjs.utc(player.last_match_time).local().fromNow()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PlayerCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <div className="h-6 w-8 rounded-sm hud-skeleton" />
        <div className="size-12 rounded-sm hud-skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-sm hud-skeleton" />
          <div className="h-3 w-1/2 rounded-sm hud-skeleton" />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 border-t border-frame/60 pt-3">
        <div className="h-10 rounded-sm hud-skeleton" />
        <div className="h-10 rounded-sm hud-skeleton" />
      </CardContent>
    </Card>
  );
}
