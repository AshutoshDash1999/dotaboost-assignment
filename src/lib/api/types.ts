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
    steamid?: string;
  };
  rank_tier: number | null;
  leaderboard_rank?: number | null;
  computed_mmr?: number | null;
  fh_unavailable?: boolean;
  aliases?: { personaname: string; name_since: string }[];
}

export interface WinLoss {
  win: number;
  lose: number;
}

export interface RecentMatch {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  hero_id: number;
  start_time: number;
  duration: number;
  game_mode: number;
  lobby_type: number;
  kills: number;
  deaths: number;
  assists: number;
  gold_per_min: number;
  xp_per_min: number;
  hero_damage: number;
  last_hits: number;
  average_rank?: number | null;
}

export interface PlayerHero {
  hero_id: number;
  last_played: number;
  games: number;
  win: number;
  with_games: number;
  with_win: number;
  against_games: number;
  against_win: number;
}

export interface HeroConstant {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
}

export interface PlayerTotal {
  field: string;
  // Matches that recorded this field; parsed-only stats have a smaller n
  n: number;
  sum: number;
}

export interface CategoryCount {
  games: number;
  win: number;
}

// Each category maps an ID (lane role, game mode, …) to its games and wins
export interface PlayerCounts {
  lane_role: Record<string, CategoryCount>;
  game_mode: Record<string, CategoryCount>;
  lobby_type: Record<string, CategoryCount>;
  region: Record<string, CategoryCount>;
  patch: Record<string, CategoryCount>;
  leaver_status: Record<string, CategoryCount>;
  is_radiant: Record<string, CategoryCount>;
}

export interface HistogramBin {
  // Lower bound of the bin
  x: number;
  games: number;
  win: number;
}
