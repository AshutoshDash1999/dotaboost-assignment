import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TopPlayer } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { getRankLabel } from "@/lib/rank";

export function PlayerCard({
  player,
  position,
}: {
  player: TopPlayer;
  position: number;
}) {
  return (
    <Link
      href={`/players/${player.account_id}`}
      className="rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="flex items-center gap-3">
          <span className="w-8 shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">
            #{position}
          </span>
          <Image
            src={player.avatarfull}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-full"
          />
          <div className="min-w-0">
            <CardTitle className="truncate">
              {player.personaname || "Anonymous"}
            </CardTitle>
            <CardDescription>{getRankLabel(player.rank_tier)}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">MMR</p>
            <p className="font-semibold tabular-nums">
              {Math.round(player.computed_mmr).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last match</p>
            <p className="font-medium">
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
    <Card className="animate-pulse">
      <CardHeader className="flex items-center gap-3">
        <div className="h-4 w-8 rounded bg-muted" />
        <div className="size-12 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <div className="h-9 rounded bg-muted" />
        <div className="h-9 rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
