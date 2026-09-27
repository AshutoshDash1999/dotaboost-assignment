import Image from "next/image";
import { getRankLabel, getRankMedal } from "@/lib/rank";
import { cn } from "@/lib/utils";

// Size it with a `size-*` class; the image art is served at 128px
export function RankMedal({
  rankTier,
  leaderboardRank,
  className,
}: {
  rankTier: number | null;
  leaderboardRank?: number | null;
  className?: string;
}) {
  const medal = getRankMedal(rankTier, leaderboardRank);
  const label = getRankLabel(rankTier);

  return (
    <div
      className={cn(
        "@container relative size-12 shrink-0 drop-shadow-[0_0_10px_var(--glow)]",
        className,
      )}
      title={leaderboardRank ? `${label} #${leaderboardRank}` : label}
    >
      <Image
        src={medal.icon}
        alt={label}
        width={128}
        height={128}
        className="size-full"
      />
      {medal.star && (
        <Image
          src={medal.star}
          alt=""
          width={128}
          height={128}
          className="absolute inset-0 size-full"
        />
      )}
      {medal.isImmortal && leaderboardRank && (
        <span className="absolute inset-x-0 bottom-[12%] text-center font-heading text-[22cqw] leading-none font-bold text-white [text-shadow:0_1px_2px_rgb(0_0_0/80%)]">
          {leaderboardRank}
        </span>
      )}
    </div>
  );
}
