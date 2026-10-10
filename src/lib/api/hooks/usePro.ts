import { dotaApi } from "../config";
import { ENDPOINTS } from "../endpoints";
import type {
  League,
  ProMatch,
  ProPlayer,
  Team,
  TeamHero,
  TeamMatch,
  TeamPlayer,
} from "../types";

// Pro rosters and league lists change slowly and are large; fetch rarely
const PRO_STALE_MS = 30 * 60_000;

const useProQuery = <T>(url: string, key: unknown[]) =>
  dotaApi.useQuery<T>({ url, key, staleTime: PRO_STALE_MS });

export const useProPlayers = () => {
  const query = useProQuery<ProPlayer[]>(ENDPOINTS.PRO_PLAYERS, [
    ENDPOINTS.PRO_PLAYERS,
  ]);
  return { proPlayers: (query.data ?? []) as ProPlayer[], ...query };
};

// Sorted by rating; the first page covers every team that matters
export const useTeams = () => {
  const query = useProQuery<Team[]>(ENDPOINTS.TEAMS, [ENDPOINTS.TEAMS]);
  return { teams: (query.data ?? []) as Team[], ...query };
};

const teamPath = (teamId: string, sub = "") =>
  `${ENDPOINTS.TEAMS}/${teamId}${sub && `/${sub}`}`;

export const useTeam = (teamId: string) => {
  const query = dotaApi.useQuery<Team>({
    url: teamPath(teamId),
    key: [ENDPOINTS.TEAMS, teamId],
    staleTime: PRO_STALE_MS,
    retry: false,
  });
  // Unknown IDs answer 200 with an empty body rather than 404
  const team = query.data as Team | undefined;
  return { team: team?.team_id ? team : undefined, ...query };
};

export const useTeamMatches = (teamId: string) => {
  const query = useProQuery<TeamMatch[]>(teamPath(teamId, "matches"), [
    ENDPOINTS.TEAMS,
    teamId,
    "matches",
  ]);
  return { matches: (query.data ?? []) as TeamMatch[], ...query };
};

export const useTeamPlayers = (teamId: string) => {
  const query = useProQuery<TeamPlayer[]>(teamPath(teamId, "players"), [
    ENDPOINTS.TEAMS,
    teamId,
    "players",
  ]);
  return { players: (query.data ?? []) as TeamPlayer[], ...query };
};

export const useTeamHeroes = (teamId: string) => {
  const query = useProQuery<TeamHero[]>(teamPath(teamId, "heroes"), [
    ENDPOINTS.TEAMS,
    teamId,
    "heroes",
  ]);
  return { heroes: (query.data ?? []) as TeamHero[], ...query };
};

export const useLeagues = () => {
  const query = useProQuery<League[]>(ENDPOINTS.LEAGUES, [ENDPOINTS.LEAGUES]);
  return { leagues: (query.data ?? []) as League[], ...query };
};

const leaguePath = (leagueId: string, sub = "") =>
  `${ENDPOINTS.LEAGUES}/${leagueId}${sub && `/${sub}`}`;

export const useLeague = (leagueId: string) => {
  const query = dotaApi.useQuery<League>({
    url: leaguePath(leagueId),
    key: [ENDPOINTS.LEAGUES, leagueId],
    staleTime: PRO_STALE_MS,
    retry: false,
  });
  const league = query.data as League | undefined;
  return { league: league?.leagueid ? league : undefined, ...query };
};

type LeagueMatch = ProMatch & {
  radiant_team_name?: string | null;
  dire_team_name?: string | null;
};

export const useLeagueMatches = (leagueId: string) => {
  const query = useProQuery<LeagueMatch[]>(leaguePath(leagueId, "matches"), [
    ENDPOINTS.LEAGUES,
    leagueId,
    "matches",
  ]);
  // League matches name teams differently from /proMatches; align them
  const matches: ProMatch[] = ((query.data ?? []) as LeagueMatch[])
    .map((match) => ({
      ...match,
      radiant_name: match.radiant_name ?? match.radiant_team_name,
      dire_name: match.dire_name ?? match.dire_team_name,
    }))
    .sort((a, b) => b.start_time - a.start_time);
  return { matches, ...query };
};

export const useLeagueTeams = (leagueId: string) => {
  const query = useProQuery<Team[]>(leaguePath(leagueId, "teams"), [
    ENDPOINTS.LEAGUES,
    leagueId,
    "teams",
  ]);
  // The endpoint pads its list with all-null rows
  const teams = ((query.data ?? []) as Team[]).filter((team) => team.team_id);
  return { teams, ...query };
};
