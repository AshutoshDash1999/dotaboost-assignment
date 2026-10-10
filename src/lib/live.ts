import type { LiveGame } from "@/lib/api/types";

// League games first, then the most watched
export function sortLiveGames(games: LiveGame[]) {
  return [...games].sort(
    (a, b) =>
      Number(Boolean(b.league_id)) - Number(Boolean(a.league_id)) ||
      (b.spectators ?? 0) - (a.spectators ?? 0),
  );
}
