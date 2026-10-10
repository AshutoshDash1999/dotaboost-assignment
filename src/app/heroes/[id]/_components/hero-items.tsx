"use client";

import { ItemIcon } from "@/components/item-icon";
import { winRateColor } from "@/components/stat-tile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useHeroItemPopularity,
  useHeroItemTimings,
  useItems,
} from "@/lib/api/hooks";
import type { HeroItemPopularity, ItemTiming } from "@/lib/api/types";
import { formatDuration, formatPercent, winRate } from "@/lib/dota";
import { cn } from "@/lib/utils";
import { tabPlaceholder } from "./tab-placeholder";

const ITEMS_PER_PHASE = 8;
const TIMING_ITEMS = 8;
const MIN_TIMING_GAMES = 5;

const PHASES: { key: keyof HeroItemPopularity; label: string }[] = [
  { key: "start_game_items", label: "Starting items" },
  { key: "early_game_items", label: "Early game" },
  { key: "mid_game_items", label: "Mid game" },
  { key: "late_game_items", label: "Late game" },
];

// Rows come per item per time bucket; keep the most bought items
function groupTimings(timings: ItemTiming[]) {
  const byItem = new Map<string, ItemTiming[]>();
  for (const row of timings) {
    if (Number(row.games) < MIN_TIMING_GAMES) continue;
    byItem.set(row.item, [...(byItem.get(row.item) ?? []), row]);
  }
  return [...byItem.entries()]
    .map(([item, rows]) => ({
      item,
      rows: rows.sort((a, b) => a.time - b.time),
      games: rows.reduce((sum, row) => sum + Number(row.games), 0),
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, TIMING_ITEMS);
}

export function HeroItems({ heroId }: { heroId: string }) {
  const popularity = useHeroItemPopularity(heroId);
  const timings = useHeroItemTimings(heroId);
  const items = useItems();

  const placeholder = tabPlaceholder(
    [popularity, timings, items],
    "Couldn't load items.",
  );
  if (placeholder) return placeholder;

  const grouped = groupTimings(timings.itemTimings);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PHASES.map((phase) => {
          const entries = Object.entries(
            popularity.itemPopularity?.[phase.key] ?? {},
          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, ITEMS_PER_PHASE);

          return (
            <Card key={phase.key} size="sm">
              <CardHeader>
                <CardTitle>{phase.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {entries.length === 0 ? (
                  <p className="text-muted-foreground">No data.</p>
                ) : (
                  <ol className="space-y-2">
                    {entries.map(([itemId, count]) => {
                      const item = items.itemsById[itemId];
                      return (
                        <li key={itemId} className="flex items-center gap-2">
                          <ItemIcon item={item} />
                          <span className="min-w-0 flex-1 truncate">
                            {item?.dname ?? "Unknown item"}
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {count.toLocaleString()}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Purchase counts from professional games.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Item timings</CardTitle>
          <CardDescription>
            Win rate when the item was bought before each time. Earlier usually
            wins more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {grouped.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              Not enough timing data yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {grouped.map((group) => {
                const item = items.itemsByName[group.item];
                return (
                  <li
                    key={group.item}
                    className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <div className="flex w-48 shrink-0 items-center gap-2">
                      <ItemIcon item={item} />
                      <span className="truncate font-medium">
                        {item?.dname ?? group.item}
                      </span>
                    </div>
                    <ol className="flex flex-wrap gap-1.5">
                      {group.rows.map((row) => {
                        const rate = winRate(
                          Number(row.wins),
                          Number(row.games),
                        );
                        return (
                          <li
                            key={row.time}
                            title={`${Number(row.games).toLocaleString()} games`}
                            className="rounded-sm border border-frame bg-muted/30 px-2 py-1 text-xs tabular-nums"
                          >
                            <span className="text-muted-foreground">
                              &lt; {formatDuration(row.time)}
                            </span>
                            <span
                              className={cn(
                                "ml-1.5 font-semibold",
                                winRateColor(rate),
                              )}
                            >
                              {formatPercent(rate)}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
