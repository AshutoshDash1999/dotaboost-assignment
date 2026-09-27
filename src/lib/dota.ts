const STEAM_CDN = "https://cdn.cloudflare.steamstatic.com";

// Slots 0–127 are Radiant, 128+ are Dire; matches carry no per-player win flag
export function isWin(match: { player_slot: number; radiant_win: boolean }) {
  return match.player_slot < 128 === match.radiant_win;
}

export function winRate(win: number, games: number): number | null {
  return games > 0 ? (win / games) * 100 : null;
}

export function formatPercent(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

// Constants give relative paths with a trailing "?" cache-buster
export function heroImageUrl(path: string): string {
  return `${STEAM_CDN}${path.replace(/\?$/, "")}`;
}

// lane_role IDs from OpenDota; 0 means the match wasn't parsed
export const LANE_ROLES: Record<string, string> = {
  "1": "Safe lane",
  "2": "Mid lane",
  "3": "Off lane",
  "4": "Jungle",
};
