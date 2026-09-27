const MEDALS = [
  "Uncalibrated",
  "Herald",
  "Guardian",
  "Crusader",
  "Archon",
  "Legend",
  "Ancient",
  "Divine",
  "Immortal",
];

export function getRankLabel(rankTier: number | null): string {
  if (!rankTier) return "Uncalibrated";
  if (rankTier >= 80) return "Immortal";
  const medal = MEDALS[Math.floor(rankTier / 10)] ?? "Uncalibrated";
  const stars = rankTier % 10;
  return stars ? `${medal} ${stars}` : medal;
}

const RANK_ICONS = "https://www.opendota.com/assets/images/dota2/rank_icons";
const IMMORTAL = 8;

export function getRankMedal(
  rankTier: number | null,
  leaderboardRank?: number | null,
) {
  const medal = rankTier ? Math.min(Math.floor(rankTier / 10), IMMORTAL) : 0;
  const stars = rankTier && medal < IMMORTAL ? rankTier % 10 : 0;

  // Immortal has dedicated art for the top 100 and top 10
  let icon = `rank_icon_${medal}`;
  if (medal === IMMORTAL && leaderboardRank) {
    if (leaderboardRank <= 10) icon += "c";
    else if (leaderboardRank <= 100) icon += "b";
  }

  return {
    icon: `${RANK_ICONS}/${icon}.png`,
    star: stars ? `${RANK_ICONS}/rank_star_${stars}.png` : null,
    isImmortal: medal === IMMORTAL,
  };
}
