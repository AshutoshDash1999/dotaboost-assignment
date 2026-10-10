"use client";

import { QueryError } from "@/components/query-error";
import { winRateColor } from "@/components/stat-tile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMiscScenarios } from "@/lib/api/hooks";
import { formatPercent, winRate } from "@/lib/dota";
import { cn } from "@/lib/utils";

const SCENARIOS: Record<string, string> = {
  first_blood: "Draws first blood",
  courier_kill: "Kills a courier first",
  pos_chat_1min: "Positive chat in the first minute",
  neg_chat_1min: "Negative chat in the first minute",
};

export function TeamScenarios() {
  const query = useMiscScenarios();

  if (query.isError) {
    return <QueryError message="Couldn't load scenarios." queries={[query]} />;
  }

  // Rows are split by region; total them per scenario and side
  const totals = new Map<string, { games: number; wins: number }>();
  for (const row of query.scenarios) {
    const key = `${row.scenario}:${row.is_radiant}`;
    const total = totals.get(key) ?? { games: 0, wins: 0 };
    total.games += Number(row.games);
    total.wins += Number(row.wins);
    totals.set(key, total);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team scenarios</CardTitle>
        <CardDescription>
          Win rate of the team that does it, by side
        </CardDescription>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <div className="h-48 rounded-sm hud-skeleton" />
        ) : (
          <ul className="divide-y divide-border">
            {Object.entries(SCENARIOS).map(([scenario, label]) => (
              <li
                key={scenario}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="min-w-0 flex-1">{label}</span>
                {[true, false].map((isRadiant) => {
                  const total = totals.get(`${scenario}:${isRadiant}`);
                  const rate = total ? winRate(total.wins, total.games) : null;
                  return (
                    <span
                      key={String(isRadiant)}
                      title={
                        total
                          ? `${total.games.toLocaleString()} games`
                          : undefined
                      }
                      className="w-24 shrink-0 text-right text-sm tabular-nums"
                    >
                      <span
                        className={cn(
                          "mr-1.5 text-[10px] tracking-wider uppercase",
                          isRadiant ? "text-radiant" : "text-dire",
                        )}
                      >
                        {isRadiant ? "Rad" : "Dire"}
                      </span>
                      <span className={winRateColor(rate)}>
                        {formatPercent(rate)}
                      </span>
                    </span>
                  );
                })}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
