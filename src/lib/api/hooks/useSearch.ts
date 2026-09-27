import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type { PlayerProfile, SearchResult } from "../types";

export const useSearchPlayers = (q: string | null) => {
  const query = dotaApi.useQuery<SearchResult[]>({
    url: ENDPOINTS.SEARCH,
    params: { q },
    key: [ENDPOINTS.SEARCH, q],
    enabled: !!q,
  });

  return {
    searchResults: (query.data ?? []) as SearchResult[],
    isSearching: query.isLoading,
    ...query,
  };
};

export const usePlayerLookup = (accountId: string | null) => {
  const query = dotaApi.useQuery<PlayerProfile>({
    url: `${ENDPOINTS.PLAYERS}/${accountId}`,
    key: [ENDPOINTS.PLAYERS, accountId],
    enabled: !!accountId,
    // A 404 means the account doesn't exist; retrying won't change that
    retry: false,
  });

  return {
    player: query.data as PlayerProfile | undefined,
    isLookingUp: query.isLoading,
    ...query,
  };
};
