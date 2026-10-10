"use client";

import { QueryError } from "@/components/query-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlayerWardMap, usePlayerWordCloud } from "@/lib/api/hooks";
import { usePlayerFilters } from "../_hooks/use-player-filters";
import { PlayerTabSkeleton } from "./player-skeleton";
import { WardHeatmap } from "./ward-heatmap";

const TOP_WORDS = 60;

function WordCloud({ counts }: { counts: Record<string, number> | null }) {
  const words = Object.entries(counts ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_WORDS);

  if (words.length === 0) {
    return (
      <p className="py-6 text-center text-muted-foreground">
        No chat recorded.
      </p>
    );
  }

  // Log scale keeps one spammed word from dwarfing the rest
  const max = Math.log(words[0][1] + 1);

  return (
    <ul className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
      {words.map(([word, count]) => {
        const weight = Math.log(count + 1) / max;
        return (
          <li
            key={word}
            title={`${count.toLocaleString()}×`}
            className="leading-tight"
            style={{
              fontSize: `${0.75 + weight * 1.5}rem`,
              opacity: 0.45 + weight * 0.55,
              color: weight > 0.7 ? "var(--gold)" : undefined,
            }}
          >
            {word}
          </li>
        );
      })}
    </ul>
  );
}

export function PlayerActivity({ accountId }: { accountId: string }) {
  const { filters } = usePlayerFilters();
  const wardMap = usePlayerWardMap(accountId, filters);
  const wordCloud = usePlayerWordCloud(accountId, filters);

  const queries = [wardMap, wordCloud];

  if (queries.some((query) => query.isError)) {
    return <QueryError message="Couldn't load activity." queries={queries} />;
  }

  if (queries.some((query) => query.isLoading)) return <PlayerTabSkeleton />;

  const wards = [
    {
      label: "Observer wards",
      cells: wardMap.wardMap?.obs ?? {},
      color: "var(--gold)",
    },
    {
      label: "Sentry wards",
      cells: wardMap.wardMap?.sen ?? {},
      color: "oklch(0.7 0.14 230)",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {wards.map((ward) => (
          <Card key={ward.label}>
            <CardHeader>
              <CardTitle>{ward.label}</CardTitle>
              <CardDescription>
                Where this player places them, from parsed matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(ward.cells).length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">
                  No wards recorded for these filters.
                </p>
              ) : (
                <WardHeatmap
                  cells={ward.cells}
                  color={ward.color}
                  label={ward.label}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Their words</CardTitle>
            <CardDescription>Most used words in all chat</CardDescription>
          </CardHeader>
          <CardContent>
            <WordCloud counts={wordCloud.wordCloud?.my_word_counts ?? null} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Words in their games</CardTitle>
            <CardDescription>
              What everyone else typed in the same matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WordCloud counts={wordCloud.wordCloud?.all_word_counts ?? null} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
