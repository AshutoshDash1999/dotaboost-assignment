import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import { RankMedal } from "@/components/rank-medal";
import { Button } from "@/components/ui/button";
import type { PlayerProfile } from "@/lib/api/types";
import { getRankLabel } from "@/lib/rank";

export function PlayerHeader({ player }: { player: PlayerProfile }) {
  const profile = player.profile;
  const details = [
    getRankLabel(player.rank_tier),
    profile?.loccountrycode,
    `ID ${profile?.account_id}`,
  ].filter(Boolean);

  return (
    <header className="overflow-hidden hud-panel p-5 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_0%_0%,var(--glow),transparent_70%)] opacity-50"
      />
      <div className="relative flex items-center gap-4 sm:gap-6">
        <div className="shrink-0 rounded-sm border-2 border-gold/70 bg-card p-1 shadow-[0_0_24px_-6px_var(--glow)]">
          {profile?.avatarfull ? (
            <Image
              src={profile.avatarfull}
              alt=""
              width={96}
              height={96}
              priority
              className="size-16 rounded-[2px] sm:size-24"
            />
          ) : (
            <div className="size-16 rounded-[2px] bg-muted sm:size-24" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-muted-foreground uppercase">
            Player profile
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="truncate font-heading text-2xl font-bold tracking-wide sm:text-4xl">
              {profile?.personaname || "Anonymous"}
            </h1>
            {profile?.plus && (
              <span className="shrink-0 rounded-sm border border-gold/50 bg-gold/15 px-1.5 py-0.5 font-heading text-[10px] font-bold tracking-wider text-gold uppercase">
                Plus
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span>{details.join(" · ")}</span>
            {profile?.profileurl && (
              <Button
                variant="outline"
                size="xs"
                nativeButton={false}
                render={
                  // biome-ignore lint/a11y/useAnchorContent: children are passed via render
                  <a
                    href={profile.profileurl}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                Steam profile
                <IconExternalLink />
              </Button>
            )}
          </div>
        </div>
        <RankMedal
          rankTier={player.rank_tier}
          leaderboardRank={player.leaderboard_rank}
          className="hidden size-24 sm:block"
        />
      </div>
    </header>
  );
}
