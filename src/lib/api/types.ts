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

export interface ItemConstant {
  id: number;
  img: string;
  dname?: string;
  cost?: number | null;
}

// Generic dotaconstants entry, e.g. game_mode, lobby_type
export interface NamedConstant {
  id: number;
  name: string;
}

export interface PickBan {
  is_pick: boolean;
  hero_id: number;
  // 0 = Radiant, 1 = Dire
  team: number;
  order: number;
}

export interface TimedEvent {
  time: number;
  key: string;
}

export interface ChatEntry {
  time: number;
  // "chat" for typed messages, "chatwheel" for wheel phrases
  type: string;
  key: string;
  player_slot?: number | null;
  unit?: string;
}

export interface MatchTeam {
  team_id: number;
  name: string;
  tag?: string;
  logo_url?: string | null;
}

export interface MatchPlayer {
  account_id?: number | null;
  personaname?: string | null;
  name?: string | null;
  player_slot: number;
  isRadiant: boolean;
  hero_id: number;
  level: number;
  kills: number;
  deaths: number;
  assists: number;
  last_hits: number;
  denies: number;
  gold_per_min: number;
  xp_per_min: number;
  net_worth?: number;
  hero_damage?: number;
  tower_damage?: number;
  hero_healing?: number;
  item_0: number;
  item_1: number;
  item_2: number;
  item_3: number;
  item_4: number;
  item_5: number;
  backpack_0?: number;
  backpack_1?: number;
  backpack_2?: number;
  item_neutral?: number;
  rank_tier?: number | null;
  // Parsed matches only
  purchase_log?: TimedEvent[] | null;
}

export interface Match {
  match_id: number;
  start_time: number;
  duration: number;
  radiant_win: boolean;
  radiant_score: number;
  dire_score: number;
  game_mode: number;
  lobby_type: number;
  region?: number;
  first_blood_time?: number;
  leagueid?: number;
  league?: { leagueid: number; name: string; tier?: string } | null;
  radiant_team?: MatchTeam | null;
  dire_team?: MatchTeam | null;
  picks_bans?: PickBan[] | null;
  players: MatchPlayer[];
  // Parsed matches only
  radiant_gold_adv?: number[] | null;
  radiant_xp_adv?: number[] | null;
  chat?: ChatEntry[] | null;
  od_data?: { has_parsed?: boolean };
}

export interface ParseRequest {
  job?: { jobId: number };
}

// Query filters shared by the /players/{id}/* aggregation endpoints
export interface PlayerFilters {
  date?: string;
  patch?: string;
  game_mode?: string;
  lobby_type?: string;
  lane_role?: string;
  hero_id?: string;
  is_radiant?: string;
  win?: string;
}

export interface PlayerMatch {
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
  average_rank?: number | null;
  party_size?: number | null;
  leaver_status?: number;
}

export interface PlayerPeer {
  account_id: number;
  personaname: string | null;
  name?: string | null;
  avatarfull?: string | null;
  last_played: number;
  with_games: number;
  with_win: number;
  against_games: number;
  against_win: number;
}

export interface PlayerPro {
  account_id: number;
  name: string | null;
  personaname?: string | null;
  team_name?: string | null;
  team_tag?: string | null;
  avatarfull?: string | null;
  last_played?: number | null;
  with_games: number;
  with_win: number;
  against_games: number;
  against_win: number;
}

export interface PlayerRanking {
  hero_id: number;
  score: number;
  // Share of ranked players on this hero that score below this player
  percent_rank: number;
}

export interface PlayerRating {
  match_id: number;
  rank_tier: number;
  time: number;
}

// Outer key is the x cell, inner key the y cell (~64–192), value the count
export type WardCells = Record<string, Record<string, number>>;

export interface PlayerWardMap {
  obs: WardCells;
  sen: WardCells;
}

export interface PlayerWordCloud {
  my_word_counts: Record<string, number> | null;
  all_word_counts: Record<string, number> | null;
}

export interface PatchConstant {
  id: number;
  name: string;
  date: string;
}

// Picks and wins per rank bracket: 1 = Herald … 8 = Immortal
type BracketStats = {
  [K in `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}_${"pick" | "win"}`]: number;
};

export interface HeroStats extends HeroConstant, BracketStats {
  pub_pick: number;
  pub_win: number;
  pro_pick: number;
  pro_win: number;
  pro_ban: number;
  turbo_picks: number;
  turbo_wins: number;
  base_health: number;
  base_health_regen: number;
  base_mana: number;
  base_mana_regen: number;
  base_armor: number;
  base_mr: number;
  base_attack_min: number;
  base_attack_max: number;
  base_str: number;
  base_agi: number;
  base_int: number;
  str_gain: number;
  agi_gain: number;
  int_gain: number;
  attack_range: number;
  attack_rate: number;
  move_speed: number;
  day_vision: number;
  night_vision: number;
}

export interface HeroMatchup {
  hero_id: number;
  games_played: number;
  wins: number;
}

export interface HeroDuration {
  // Lower bound of the bin, in seconds
  duration_bin: number;
  games_played: number;
  wins: number;
}

// Item ID → purchase count, per game phase
export interface HeroItemPopularity {
  start_game_items: Record<string, number>;
  early_game_items: Record<string, number>;
  mid_game_items: Record<string, number>;
  late_game_items: Record<string, number>;
}

export interface HeroProMatch {
  match_id: number;
  start_time: number;
  duration: number;
  radiant_win: boolean;
  radiant: boolean;
  league_name?: string | null;
  account_id: number;
  kills: number;
  deaths: number;
  assists: number;
}

export interface HeroRankingEntry {
  account_id: number;
  score: number;
  personaname: string | null;
  name?: string | null;
  avatar?: string | null;
  rank_tier?: number | null;
}

export interface HeroRankings {
  hero_id: number;
  rankings: HeroRankingEntry[];
}

export interface BenchmarkPoint {
  percentile: number;
  value: number;
}

export interface HeroBenchmarks {
  hero_id: number;
  result: Record<string, BenchmarkPoint[]>;
}

// Scenario counts come back as strings
export interface ItemTiming {
  item: string;
  time: number;
  games: string;
  wins: string;
}

export interface LaneRoleScenario {
  lane_role: number;
  time: number;
  games: string;
  wins: string;
}

export interface ProMatch {
  match_id: number;
  start_time: number;
  duration: number;
  radiant_win: boolean;
  radiant_score: number;
  dire_score: number;
  radiant_team_id?: number | null;
  radiant_name?: string | null;
  dire_team_id?: number | null;
  dire_name?: string | null;
  leagueid?: number;
  league_name?: string | null;
}

export interface PublicMatch {
  match_id: number;
  start_time: number;
  duration: number;
  radiant_win: boolean;
  game_mode: number;
  lobby_type: number;
  avg_rank_tier?: number | null;
  radiant_team: number[];
  dire_team: number[];
}

export interface ProPlayer {
  account_id: number;
  name: string;
  personaname?: string | null;
  team_id?: number | null;
  team_name?: string | null;
  team_tag?: string | null;
  country_code?: string | null;
  // 1 = core, 2 = support, 0 = unknown
  fantasy_role?: number | null;
  avatarfull?: string | null;
  last_match_time?: string | null;
}

export interface Team {
  team_id: number;
  name: string;
  tag?: string | null;
  logo_url?: string | null;
  rating?: number | null;
  wins: number;
  losses: number;
  last_match_time?: number | null;
}

export interface TeamMatch {
  match_id: number;
  start_time: number;
  duration: number;
  radiant: boolean;
  radiant_win: boolean;
  radiant_score: number;
  dire_score: number;
  leagueid?: number;
  league_name?: string | null;
  opposing_team_id?: number | null;
  opposing_team_name?: string | null;
  opposing_team_logo?: string | null;
}

export interface TeamPlayer {
  account_id: number;
  name: string | null;
  games_played: number;
  wins: number;
  is_current_team_member: boolean | null;
}

export interface TeamHero {
  hero_id: number;
  localized_name?: string;
  games_played: number;
  wins: number;
}

export interface League {
  leagueid: number;
  name: string;
  // premium, professional, amateur or excluded
  tier?: string | null;
  banner?: string | null;
}
