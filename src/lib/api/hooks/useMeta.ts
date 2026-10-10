import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type {
  FoundMatch,
  LiveGame,
  MatchRecord,
  MiscScenario,
  RankDistribution,
} from "../types";

const LIVE_POLL_MS = 30_000;
const META_STALE_MS = 60 * 60_000;

export const useLiveGames = () => {
  const query = dotaApi.useQuery<LiveGame[]>({
    url: ENDPOINTS.LIVE,
    key: [ENDPOINTS.LIVE],
    staleTime: 0,
    refetchInterval: LIVE_POLL_MS,
  });

  return { games: (query.data ?? []) as LiveGame[], ...query };
};

export const useRecords = (field: string) => {
  const query = dotaApi.useQuery<MatchRecord[]>({
    url: `${ENDPOINTS.RECORDS}/${field}`,
    key: [ENDPOINTS.RECORDS, field],
    staleTime: META_STALE_MS,
  });

  return { records: (query.data ?? []) as MatchRecord[], ...query };
};

export const useRankDistribution = () => {
  const query = dotaApi.useQuery<RankDistribution>({
    url: ENDPOINTS.DISTRIBUTIONS,
    key: [ENDPOINTS.DISTRIBUTIONS],
    staleTime: META_STALE_MS,
  });

  return {
    distribution: (query.data as RankDistribution | undefined)?.ranks,
    ...query,
  };
};

export const useMiscScenarios = () => {
  const query = dotaApi.useQuery<MiscScenario[]>({
    url: `${ENDPOINTS.SCENARIOS}/misc`,
    key: [ENDPOINTS.SCENARIOS, "misc"],
    staleTime: META_STALE_MS,
  });

  return { scenarios: (query.data ?? []) as MiscScenario[], ...query };
};

export const useFindMatches = (teamA: number[], teamB: number[]) => {
  const query = dotaApi.useQuery<FoundMatch[]>({
    url: ENDPOINTS.FIND_MATCHES,
    params: { teamA, teamB },
    // The API wants repeated keys (teamA=1&teamA=2); commas return a 500
    paramsSerializer: { indexes: null },
    key: [ENDPOINTS.FIND_MATCHES, teamA, teamB],
    enabled: teamA.length + teamB.length > 0,
  });

  return { matches: (query.data ?? []) as FoundMatch[], ...query };
};
