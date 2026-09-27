export interface TopPlayer {
  account_id: number;
  computed_mmr: number;
  personaname: string;
  avatarfull: string;
  rank_tier: number | null;
  last_match_time: string | null;
  delta?: number;
  match_id?: number;
  steamid?: string;
  avatar?: string;
  avatarmedium?: string;
  profileurl?: string;
  loccountrycode?: string | null;
  name?: string | null;
  team_name?: string | null;
  is_pro?: boolean | null;
  rating?: number | null;
  plus?: boolean;
  fh_unavailable?: boolean;
}

export interface SearchResult {
  account_id: number;
  personaname: string | null;
  avatarfull: string | null;
  last_match_time: string | null;
  sml?: number;
}

export interface PlayerProfile {
  profile?: {
    account_id: number;
    personaname: string | null;
    name?: string | null;
    avatarfull: string | null;
    profileurl?: string;
    loccountrycode?: string | null;
    plus?: boolean;
  };
  rank_tier: number | null;
  leaderboard_rank?: number | null;
  computed_mmr?: number | null;
  fh_unavailable?: boolean;
}
