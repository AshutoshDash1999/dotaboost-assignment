import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type { ItemConstant } from "../types";

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

// Players carry numeric item IDs; item details are keyed by name
export const useItems = () => {
  const ids = useConstant<Record<string, string>>("item_ids");
  const items = useConstant<Record<string, ItemConstant>>("items");

  const byName = items.constant ?? {};
  const byId: Record<string, ItemConstant> = {};
  for (const [id, name] of Object.entries(ids.constant ?? {})) {
    if (byName[name]) byId[id] = byName[name];
  }

  return {
    itemsById: byId,
    itemsByName: byName,
    isLoading: ids.isLoading || items.isLoading,
    isError: ids.isError || items.isError,
    refetch: () => Promise.all([ids.refetch(), items.refetch()]),
  };
};
