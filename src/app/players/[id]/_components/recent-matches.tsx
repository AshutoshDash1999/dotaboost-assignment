import { MatchLink } from "@/components/entity-link";
import { HeroCell } from "@/components/hero-cell";
import { ResultBadge } from "@/components/result-badge";
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
              <thead className="text-[11px] tracking-wider text-muted-foreground uppercase">
                <tr className="border-b border-frame">
                  <th className="py-2 pr-4 pl-3.5 font-medium">Hero</th>
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
                    <tr
                      key={match.match_id}
                      className={cn(
                        "relative border-b transition-colors last:border-0 hover:bg-muted/50",
                        won ? "bg-radiant/5" : "bg-dire/5",
                      )}
                    >
                      <td
                        className={cn(
                          "border-l-[3px] py-2.5 pr-4 pl-3",
                          won ? "border-l-radiant" : "border-l-dire",
                        )}
                      >
                        {/* Stretched link: the whole row opens the match */}
                        <MatchLink
                          id={match.match_id}
                          aria-label={`Match ${match.match_id}`}
                          className="after:absolute after:inset-0"
                        >
                          <HeroCell hero={heroes[match.hero_id]} />
                        </MatchLink>
                      </td>
                      <td className="py-2.5 pr-4">
                        <ResultBadge won={won} />
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
