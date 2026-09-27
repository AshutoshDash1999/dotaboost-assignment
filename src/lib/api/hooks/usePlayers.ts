import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type { TopPlayer } from "../types";

export const useTopPlayers = () => {
  const query = dotaApi.useQuery<TopPlayer[]>({
    url: ENDPOINTS.TOP_PLAYERS,
    key: [ENDPOINTS.TOP_PLAYERS],
  });

  return {
    topPlayers: (query.data ?? []) as TopPlayer[],
    isLoadingTopPlayers: query.isLoading,
    ...query,
  };
};
