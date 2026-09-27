import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";

export const useTopPlayers = () => {
  const query = dotaApi.useQuery({
    url: ENDPOINTS.TOP_PLAYERS,
    key: [ENDPOINTS.TOP_PLAYERS],
  });

  return {
    topPlayers: query.data ?? [],
    isLoadingTopPlayers: query.isLoading,
    ...query,
  };
};
