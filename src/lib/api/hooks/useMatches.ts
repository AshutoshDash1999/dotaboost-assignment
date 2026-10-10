import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type { Match, ParseRequest } from "../types";

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
