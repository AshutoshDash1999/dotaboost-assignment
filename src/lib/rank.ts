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
