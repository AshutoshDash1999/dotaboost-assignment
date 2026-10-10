import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";

// dotaconstants resources: heroes, items, game_mode, lobby_type, patch, region, …
export const useConstant = <T>(resource: string) => {
  const query = dotaApi.useQuery<T>({
    url: `${ENDPOINTS.CONSTANTS}/${resource}`,
    key: [ENDPOINTS.CONSTANTS, resource],
    // Constants only change with patches
    staleTime: Infinity,
  });

  return {
    constant: query.data,
    ...query,
  };
};
