import type { HeroStats } from "@/lib/api/types";

export const BRACKETS = [
  { value: "pub", label: "All ranked" },
  { value: "1", label: "Herald" },
  { value: "2", label: "Guardian" },
  { value: "3", label: "Crusader" },
  { value: "4", label: "Archon" },
  { value: "5", label: "Legend" },
  { value: "6", label: "Ancient" },
  { value: "7", label: "Divine" },
  { value: "8", label: "Immortal" },
  { value: "pro", label: "Pro" },
  { value: "turbo", label: "Turbo" },
] as const;

export type Bracket = (typeof BRACKETS)[number]["value"];

type RankBracket = Extract<(typeof BRACKETS)[number], { value: `${number}` }>;

export const RANK_BRACKETS = BRACKETS.filter((b): b is RankBracket =>
  /^\d$/.test(b.value),
);

export function isBracket(value: string | null): value is Bracket {
  return BRACKETS.some((b) => b.value === value);
}

export function bracketStats(hero: HeroStats, bracket: Bracket) {
  switch (bracket) {
    case "pub":
      return { picks: hero.pub_pick, wins: hero.pub_win };
    case "pro":
      return { picks: hero.pro_pick, wins: hero.pro_win };
    case "turbo":
      return { picks: hero.turbo_picks, wins: hero.turbo_wins };
    default:
      return { picks: hero[`${bracket}_pick`], wins: hero[`${bracket}_win`] };
  }
}

export const ATTRIBUTES: Record<string, string> = {
  str: "Strength",
  agi: "Agility",
  int: "Intelligence",
  all: "Universal",
};
