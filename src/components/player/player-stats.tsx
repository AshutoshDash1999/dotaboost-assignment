import {
  IconChartLine,
  IconHistory,
  IconMedal,
  IconTrophy,
} from "@tabler/icons-react";
import { StatTile, winRateColor } from "@/components/player/stat-tile";
import { RankMedal } from "@/components/rank-medal";
import type { PlayerProfile, WinLoss } from "@/lib/api/types";
import { formatPercent, winRate } from "@/lib/dota";
import { getRankLabel } from "@/lib/rank";

export function PlayerStats({
  player,
  overall,
  recent,
  recentLimit,
}: {
  player: PlayerProfile;
  overall: WinLoss;
  recent: WinLoss;
  recentLimit: number;
}) {
  const overallRate = winRate(overall.win, overall.win + overall.lose);
  const recentRate = winRate(recent.win, recent.win + recent.lose);
  const stats = [
    {
      label: "Rank",
      icon: IconMedal,
      value: getRankLabel(player.rank_tier),
      hint: player.leaderboard_rank
        ? `Leaderboard #${player.leaderboard_rank}`
        : null,
      aside: (
        <RankMedal
          rankTier={player.rank_tier}
          leaderboardRank={player.leaderboard_rank}
          className="size-10"
        />
      ),
    },
    {
      label: "MMR (est.)",
      icon: IconChartLine,
      value: player.computed_mmr
        ? Math.round(player.computed_mmr).toLocaleString()
        : "—",
      hint: null,
    },
    {
      label: "Win rate",
      icon: IconTrophy,
      value: formatPercent(overallRate),
      valueClassName: winRateColor(overallRate),
      hint: `${overall.win.toLocaleString()}W – ${overall.lose.toLocaleString()}L`,
    },
    {
      label: `Last ${recentLimit}`,
      icon: IconHistory,
      value: formatPercent(recentRate),
      valueClassName: winRateColor(recentRate),
      hint: `${recent.win}W – ${recent.lose}L`,
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <StatTile key={stat.label} {...stat} />
      ))}
    </dl>
  );
}
