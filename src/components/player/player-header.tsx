import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
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
    <header className="flex items-center gap-4 sm:gap-6">
      {profile?.avatarfull ? (
        <Image
          src={profile.avatarfull}
          alt=""
          width={96}
          height={96}
          priority
          className="size-16 shrink-0 rounded-full sm:size-24"
        />
      ) : (
        <div className="size-16 shrink-0 rounded-full bg-muted sm:size-24" />
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="truncate font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {profile?.personaname || "Anonymous"}
          </h1>
          {profile?.plus && (
            <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              Plus
            </span>
          )}
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {details.join(" · ")}
          {profile?.profileurl && (
            <a
              href={profile.profileurl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 underline-offset-4 hover:text-foreground hover:underline"
            >
              Steam profile
              <IconExternalLink className="size-3.5" />
            </a>
          )}
        </p>
      </div>
    </header>
  );
}
