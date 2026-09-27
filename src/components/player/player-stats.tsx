import {
  IconChartLine,
  IconHistory,
  IconMedal,
  IconTrophy,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
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
  const stats = [
    {
      label: "Rank",
      icon: IconMedal,
      value: getRankLabel(player.rank_tier),
      hint: player.leaderboard_rank
        ? `Leaderboard #${player.leaderboard_rank}`
        : null,
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
      value: formatPercent(winRate(overall.win, overall.win + overall.lose)),
      hint: `${overall.win.toLocaleString()}W – ${overall.lose.toLocaleString()}L`,
    },
    {
      label: `Last ${recentLimit}`,
      icon: IconHistory,
      value: formatPercent(winRate(recent.win, recent.win + recent.lose)),
      hint: `${recent.win}W – ${recent.lose}L`,
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <stat.icon className="size-3.5 shrink-0" aria-hidden />
              {stat.label}
            </dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">
              {stat.value}
            </dd>
            {stat.hint && (
              <dd className="text-xs text-muted-foreground tabular-nums">
                {stat.hint}
              </dd>
            )}
          </CardContent>
        </Card>
      ))}
    </dl>
  );
}
