import { HeroCell } from "@/components/player/hero-cell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeroConstant, RecentMatch } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { formatCompact, formatDuration, isWin } from "@/lib/dota";
import { cn } from "@/lib/utils";

export function RecentMatches({
  matches,
  heroes,
}: {
  matches: RecentMatch[];
  heroes: Record<string, HeroConstant>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent matches</CardTitle>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No recent public matches.
          </p>
        ) : (
          <div className="-mx-(--card-spacing) overflow-x-auto px-(--card-spacing)">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 pr-4 font-medium">Hero</th>
                  <th className="py-2 pr-4 font-medium">Result</th>
                  <th className="py-2 pr-4 font-medium">K / D / A</th>
                  <th className="hidden py-2 pr-4 font-medium md:table-cell">
                    GPM / XPM
                  </th>
                  <th className="hidden py-2 pr-4 font-medium md:table-cell">
                    Damage
                  </th>
                  <th className="py-2 pr-4 font-medium">Duration</th>
                  <th className="py-2 font-medium">Played</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {matches.map((match) => {
                  const won = isWin(match);
                  return (
                    <tr key={match.match_id} className="border-b last:border-0">
                      <td className="py-2.5 pr-4">
                        <HeroCell hero={heroes[match.hero_id]} />
                      </td>
                      <td
                        className={cn(
                          "py-2.5 pr-4 font-medium",
                          won
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400",
                        )}
                      >
                        {won ? "Win" : "Loss"}
                      </td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">
                        {match.kills} / {match.deaths} / {match.assists}
                      </td>
                      <td className="hidden py-2.5 pr-4 whitespace-nowrap md:table-cell">
                        {match.gold_per_min} / {match.xp_per_min}
                      </td>
                      <td className="hidden py-2.5 pr-4 md:table-cell">
                        {formatCompact(match.hero_damage)}
                      </td>
                      <td className="py-2.5 pr-4">
                        {formatDuration(match.duration)}
                      </td>
                      <td className="py-2.5 whitespace-nowrap text-muted-foreground">
                        {dayjs.unix(match.start_time).fromNow()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
