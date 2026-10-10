import { useInfiniteQuery } from "@tanstack/react-query";
import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type { Match, ParseRequest, ProMatch, PublicMatch } from "../types";

const PARSE_POLL_MS = 5_000;

export const useMatch = (matchId: string) => {
  const query = dotaApi.useQuery<Match>({
    url: `${ENDPOINTS.MATCHES}/${matchId}`,
    key: [ENDPOINTS.MATCHES, matchId],
    // A 404 means the match doesn't exist; retrying won't change that
    retry: false,
  });

  return {
    match: query.data,
    ...query,
  };
};

// Queues a replay parse; the response carries the job to poll
export const useRequestParse = (matchId: string) =>
  dotaApi.useMutation<ParseRequest>({
    url: `${ENDPOINTS.REQUEST}/${matchId}`,
  });

// The job endpoint returns null once the parse has finished
export const useParseJob = (jobId: number | undefined) => {
  const query = dotaApi.useQuery<unknown>({
    url: `${ENDPOINTS.REQUEST}/${jobId}`,
    key: [ENDPOINTS.REQUEST, jobId],
    enabled: jobId !== undefined,
    staleTime: 0,
    refetchInterval: (q) => (q.state.data === null ? false : PARSE_POLL_MS),
  });

  return {
    isParsing: jobId !== undefined && query.data !== null,
    ...query,
  };
};

// Feeds page backwards: each request asks for matches older than the last one
const useMatchFeed = <T extends { match_id: number }>(
  url: string,
  params: Record<string, unknown> = {},
) => {
  const query = useInfiniteQuery({
    queryKey: [url, params],
    queryFn: ({ pageParam }) =>
      dotaApi.get<T[]>(url, {
        params: { ...params, less_than_match_id: pageParam },
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.match_id,
  });

  return {
    matches: query.data?.pages.flat() ?? [],
    ...query,
  };
};

export const useProMatchesFeed = () =>
  useMatchFeed<ProMatch>(ENDPOINTS.PRO_MATCHES);

// Ranks are rank_tier values, e.g. 10–15 for Herald
export const usePublicMatchesFeed = (minRank?: number, maxRank?: number) =>
  useMatchFeed<PublicMatch>(ENDPOINTS.PUBLIC_MATCHES, {
    min_rank: minRank,
    max_rank: maxRank,
  });
