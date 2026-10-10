"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PlayerFilters } from "@/lib/api/types";

export const FILTER_KEYS = [
  "date",
  "patch",
  "game_mode",
  "lobby_type",
  "lane_role",
  "hero_id",
  "is_radiant",
  "win",
] as const satisfies readonly (keyof PlayerFilters)[];

export type FilterKey = (typeof FILTER_KEYS)[number];

// Filters live in the URL, so they survive tab switches, reloads and sharing
export function usePlayerFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filters: PlayerFilters = {};
  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value) filters[key] = value;
  }

  const replace = (params: URLSearchParams) => {
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const setFilter = (key: FilterKey, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    // Page offsets don't carry over to a different result set
    params.delete("page");
    replace(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    for (const key of FILTER_KEYS) params.delete(key);
    params.delete("page");
    replace(params);
  };

  return {
    filters,
    // Stable string form for query keys and links that keep the filters
    queryString: new URLSearchParams(
      filters as Record<string, string>,
    ).toString(),
    hasFilters: Object.keys(filters).length > 0,
    setFilter,
    clearFilters,
  };
}
