import { keepPreviousData } from "@tanstack/react-query";
import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type {
  HistogramBin,
  PlayerCounts,
  PlayerFilters,
  PlayerHero,
  PlayerMatch,
  PlayerPeer,
  PlayerPro,
  PlayerRanking,
  PlayerRating,
  PlayerTotal,
  PlayerWardMap,
  PlayerWordCloud,
  RecentMatch,
  WinLoss,
} from "../types";

const playerPath = (accountId: string, sub: string) =>
  `${ENDPOINTS.PLAYERS}/${accountId}/${sub}`;

// Filtered aggregation endpoint: filters go into both the request and the key
const usePlayerQuery = <T>(
  accountId: string,
  sub: string,
  filters: PlayerFilters,
  extraParams: Record<string, unknown> = {},
) =>
  dotaApi.useQuery<T>({
    url: playerPath(accountId, sub),
    params: { ...filters, ...extraParams },
    key: [ENDPOINTS.PLAYERS, accountId, sub, filters, extraParams],
    // Keep the previous result on screen while new filters load
    placeholderData: keepPreviousData,
  });

export const usePlayerWinLoss = (
  accountId: string,
  filters: PlayerFilters = {},
  limit?: number,
) => {
  const query = usePlayerQuery<WinLoss>(accountId, "wl", filters, { limit });

  return {
    winLoss: query.data ?? { win: 0, lose: 0 },
    ...query,
  };
};

// recentMatches (unlike /matches) includes GPM, XPM and hero damage, but ignores filters
export const usePlayerRecentMatches = (accountId: string) => {
  const query = dotaApi.useQuery<RecentMatch[]>({
    url: playerPath(accountId, "recentMatches"),
    key: [ENDPOINTS.PLAYERS, accountId, "recentMatches"],
  });

  return {
    recentMatches: (query.data ?? []) as RecentMatch[],
    ...query,
  };
};

export const usePlayerMatches = (
  accountId: string,
  filters: PlayerFilters,
  page: number,
  pageSize: number,
) => {
  const query = usePlayerQuery<PlayerMatch[]>(accountId, "matches", filters, {
    limit: pageSize,
    offset: page * pageSize,
  });

  return {
    matches: (query.data ?? []) as PlayerMatch[],
    ...query,
  };
};

export const usePlayerHeroes = (
  accountId: string,
  filters: PlayerFilters = {},
) => {
  const query = usePlayerQuery<PlayerHero[]>(accountId, "heroes", filters);

  return {
    playerHeroes: (query.data ?? []) as PlayerHero[],
    ...query,
  };
};

export const usePlayerPeers = (accountId: string, filters: PlayerFilters) => {
  const query = usePlayerQuery<PlayerPeer[]>(accountId, "peers", filters);

  return {
    peers: (query.data ?? []) as PlayerPeer[],
    ...query,
  };
};

export const usePlayerPros = (accountId: string, filters: PlayerFilters) => {
  const query = usePlayerQuery<PlayerPro[]>(accountId, "pros", filters);

  return {
    pros: (query.data ?? []) as PlayerPro[],
    ...query,
  };
};

export const usePlayerTotals = (
  accountId: string,
  filters: PlayerFilters = {},
) => {
  const query = usePlayerQuery<PlayerTotal[]>(accountId, "totals", filters);

  return {
    totals: (query.data ?? []) as PlayerTotal[],
    ...query,
  };
};

export const usePlayerCounts = (
  accountId: string,
  filters: PlayerFilters = {},
) => {
  const query = usePlayerQuery<PlayerCounts>(accountId, "counts", filters);

  return {
    counts: query.data,
    ...query,
  };
};

export const usePlayerHistogram = (
  accountId: string,
  field: string,
  filters: PlayerFilters = {},
) => {
  const query = usePlayerQuery<HistogramBin[]>(
    accountId,
    `histograms/${field}`,
    filters,
  );

  return {
    bins: (query.data ?? []) as HistogramBin[],
    ...query,
  };
};

export const usePlayerWardMap = (accountId: string, filters: PlayerFilters) => {
  const query = usePlayerQuery<PlayerWardMap>(accountId, "wardmap", filters);

  return {
    wardMap: query.data,
    ...query,
  };
};

export const usePlayerWordCloud = (
  accountId: string,
  filters: PlayerFilters,
) => {
  const query = usePlayerQuery<PlayerWordCloud>(
    accountId,
    "wordcloud",
    filters,
  );

  return {
    wordCloud: query.data,
    ...query,
  };
};

export const usePlayerRankings = (accountId: string) => {
  const query = dotaApi.useQuery<PlayerRanking[]>({
    url: playerPath(accountId, "rankings"),
    key: [ENDPOINTS.PLAYERS, accountId, "rankings"],
  });

  return {
    rankings: (query.data ?? []) as PlayerRanking[],
    ...query,
  };
};

export const usePlayerRatings = (accountId: string) => {
  const query = dotaApi.useQuery<PlayerRating[]>({
    url: playerPath(accountId, "ratings"),
    key: [ENDPOINTS.PLAYERS, accountId, "ratings"],
  });

  return {
    ratings: (query.data ?? []) as PlayerRating[],
    ...query,
  };
};

// Asks OpenDota to re-fetch the match history; data updates after a delay
export const useRefreshPlayer = (accountId: string) =>
  dotaApi.useMutation({
    url: playerPath(accountId, "refresh"),
    keyToInvalidate: [ENDPOINTS.PLAYERS, accountId],
  });
