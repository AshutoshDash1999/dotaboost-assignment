import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type {
  HeroBenchmarks,
  HeroConstant,
  HeroDuration,
  HeroItemPopularity,
  HeroMatchup,
  HeroProMatch,
  HeroRankings,
  HeroStats,
  ItemTiming,
  LaneRoleScenario,
} from "../types";
import { useConstant } from "./useConstants";

// Aggregates refresh slowly; no need to refetch within a session
const HERO_STATS_STALE_MS = 60 * 60_000;

export const useHeroes = () => {
  const query = useConstant<Record<string, HeroConstant>>("heroes");

  return {
    heroes: (query.constant ?? {}) as Record<string, HeroConstant>,
    ...query,
  };
};

export const useHeroStats = () => {
  const query = dotaApi.useQuery<HeroStats[]>({
    url: ENDPOINTS.HERO_STATS,
    key: [ENDPOINTS.HERO_STATS],
    staleTime: HERO_STATS_STALE_MS,
  });

  return {
    heroStats: (query.data ?? []) as HeroStats[],
    ...query,
  };
};

const heroPath = (heroId: string, sub: string) =>
  `${ENDPOINTS.HEROES}/${heroId}/${sub}`;

const useHeroQuery = <T>(heroId: string, sub: string) =>
  dotaApi.useQuery<T>({
    url: heroPath(heroId, sub),
    key: [ENDPOINTS.HEROES, heroId, sub],
    staleTime: HERO_STATS_STALE_MS,
  });

export const useHeroMatchups = (heroId: string) => {
  const query = useHeroQuery<HeroMatchup[]>(heroId, "matchups");
  return { matchups: (query.data ?? []) as HeroMatchup[], ...query };
};

export const useHeroDurations = (heroId: string) => {
  const query = useHeroQuery<HeroDuration[]>(heroId, "durations");
  return { durations: (query.data ?? []) as HeroDuration[], ...query };
};

export const useHeroItemPopularity = (heroId: string) => {
  const query = useHeroQuery<HeroItemPopularity>(heroId, "itemPopularity");
  return {
    itemPopularity: query.data as HeroItemPopularity | undefined,
    ...query,
  };
};

export const useHeroMatches = (heroId: string) => {
  const query = useHeroQuery<HeroProMatch[]>(heroId, "matches");
  return { matches: (query.data ?? []) as HeroProMatch[], ...query };
};

export const useHeroRankings = (heroId: string) => {
  const query = dotaApi.useQuery<HeroRankings>({
    url: ENDPOINTS.RANKINGS,
    params: { hero_id: heroId },
    key: [ENDPOINTS.RANKINGS, heroId],
    staleTime: HERO_STATS_STALE_MS,
  });
  return {
    rankings: ((query.data as HeroRankings | undefined)?.rankings ??
      []) as HeroRankings["rankings"],
    ...query,
  };
};

export const useHeroBenchmarks = (heroId: string) => {
  const query = dotaApi.useQuery<HeroBenchmarks>({
    url: ENDPOINTS.BENCHMARKS,
    params: { hero_id: heroId },
    key: [ENDPOINTS.BENCHMARKS, heroId],
    staleTime: HERO_STATS_STALE_MS,
  });
  return {
    benchmarks: (query.data as HeroBenchmarks | undefined)?.result,
    ...query,
  };
};

const useScenario = <T>(scenario: string, heroId: string) =>
  dotaApi.useQuery<T[]>({
    url: `${ENDPOINTS.SCENARIOS}/${scenario}`,
    params: { hero_id: heroId },
    key: [ENDPOINTS.SCENARIOS, scenario, heroId],
    staleTime: HERO_STATS_STALE_MS,
  });

export const useHeroItemTimings = (heroId: string) => {
  const query = useScenario<ItemTiming>("itemTimings", heroId);
  return { itemTimings: (query.data ?? []) as ItemTiming[], ...query };
};

export const useHeroLaneRoles = (heroId: string) => {
  const query = useScenario<LaneRoleScenario>("laneRoles", heroId);
  return { laneRoles: (query.data ?? []) as LaneRoleScenario[], ...query };
};
