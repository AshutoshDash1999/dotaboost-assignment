import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type { TopPlayer } from "../types";

// turbo ranks by Turbo-mode rating instead of ranked MMR
export const useTopPlayers = (turbo = false) => {
  const query = dotaApi.useQuery<TopPlayer[]>({
    url: ENDPOINTS.TOP_PLAYERS,
    params: turbo ? { turbo: 1 } : undefined,
    key: [ENDPOINTS.TOP_PLAYERS, turbo],
  });

  return {
    topPlayers: (query.data ?? []) as TopPlayer[],
    isLoadingTopPlayers: query.isLoading,
    ...query,
  };
};
