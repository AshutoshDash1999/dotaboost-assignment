import { keepPreviousData } from "@tanstack/react-query";
import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type {
  HeroConstant,
  HistogramBin,
  PlayerCounts,
  PlayerHero,
  PlayerTotal,
  RecentMatch,
  WinLoss,
} from "../types";

const playerPath = (accountId: string, sub: string) =>
  `${ENDPOINTS.PLAYERS}/${accountId}/${sub}`;

export const usePlayerWinLoss = (accountId: string, limit?: number) => {
  const query = dotaApi.useQuery<WinLoss>({
    url: playerPath(accountId, "wl"),
    params: { limit },
    key: [ENDPOINTS.PLAYERS, accountId, "wl", limit],
  });

  return {
    winLoss: query.data ?? { win: 0, lose: 0 },
    ...query,
  };
};

// recentMatches (unlike /matches) includes GPM, XPM and hero damage
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

export const usePlayerHeroes = (accountId: string) => {
  const query = dotaApi.useQuery<PlayerHero[]>({
    url: playerPath(accountId, "heroes"),
    key: [ENDPOINTS.PLAYERS, accountId, "heroes"],
  });

  return {
    playerHeroes: (query.data ?? []) as PlayerHero[],
    ...query,
  };
};

export const usePlayerTotals = (accountId: string) => {
  const query = dotaApi.useQuery<PlayerTotal[]>({
    url: playerPath(accountId, "totals"),
    key: [ENDPOINTS.PLAYERS, accountId, "totals"],
  });

  return {
    totals: (query.data ?? []) as PlayerTotal[],
    ...query,
  };
};

export const usePlayerCounts = (accountId: string) => {
  const query = dotaApi.useQuery<PlayerCounts>({
    url: playerPath(accountId, "counts"),
    key: [ENDPOINTS.PLAYERS, accountId, "counts"],
  });

  return {
    counts: query.data,
    ...query,
  };
};

export const usePlayerHistogram = (accountId: string, field: string) => {
  const query = dotaApi.useQuery<HistogramBin[]>({
    url: playerPath(accountId, `histograms/${field}`),
    key: [ENDPOINTS.PLAYERS, accountId, "histograms", field],
    // Keep the previous field's bars on screen while the next one loads
    placeholderData: keepPreviousData,
  });

  return {
    bins: (query.data ?? []) as HistogramBin[],
    ...query,
  };
};

export const useHeroes = () => {
  const query = dotaApi.useQuery<Record<string, HeroConstant>>({
    url: ENDPOINTS.HEROES,
    key: [ENDPOINTS.HEROES],
    // The hero list only changes with patches
    staleTime: Infinity,
  });

  return {
    heroes: (query.data ?? {}) as Record<string, HeroConstant>,
    ...query,
  };
};
