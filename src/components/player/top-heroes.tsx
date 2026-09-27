import { HeroCell } from "@/components/player/hero-cell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeroConstant, PlayerHero } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { formatPercent, winRate } from "@/lib/dota";

export function TopHeroes({
  playerHeroes,
  heroes,
}: {
  playerHeroes: PlayerHero[];
  heroes: Record<string, HeroConstant>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top heroes</CardTitle>
      </CardHeader>
      <CardContent>
        {playerHeroes.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No hero data.
          </p>
        ) : (
          <div className="-mx-(--card-spacing) overflow-x-auto px-(--card-spacing)">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 pr-4 font-medium">Hero</th>
                  <th className="py-2 pr-4 font-medium">Games</th>
                  <th className="w-2/5 py-2 pr-4 font-medium">Win rate</th>
                  <th className="py-2 font-medium">Last played</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {playerHeroes.map((entry) => {
                  const rate = winRate(entry.win, entry.games) ?? 0;
                  return (
                    <tr key={entry.hero_id} className="border-b last:border-0">
                      <td className="py-2.5 pr-4">
                        <HeroCell hero={heroes[entry.hero_id]} />
                      </td>
                      <td className="py-2.5 pr-4">
                        {entry.games.toLocaleString()}
                      </td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 min-w-16 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="w-12 text-right">
                            {formatPercent(rate)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 whitespace-nowrap text-muted-foreground">
                        {dayjs.unix(entry.last_played).fromNow()}
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
