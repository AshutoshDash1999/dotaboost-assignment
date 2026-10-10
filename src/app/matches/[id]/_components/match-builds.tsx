import { HeroCell } from "@/components/hero-cell";
import { ItemIcon } from "@/components/item-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeroConstant, ItemConstant, Match } from "@/lib/api/types";
import { formatGameTime } from "@/lib/dota";
import { cn } from "@/lib/utils";

// Consumables and wards drown out the actual build
const HIDDEN_ITEMS = new Set([
  "tpscroll",
  "ward_observer",
  "ward_sentry",
  "ward_dispenser",
  "tango",
  "flask",
  "clarity",
  "enchanted_mango",
  "faerie_fire",
  "smoke_of_deceit",
  "dust",
  "blood_grenade",
  "tome_of_knowledge",
]);

export function MatchBuilds({
  match,
  heroes,
  items,
}: {
  match: Match;
  heroes: Record<string, HeroConstant>;
  items: Record<string, ItemConstant>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item builds</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {match.players.map((player) => {
          const purchases = (player.purchase_log ?? []).filter(
            (purchase) => !HIDDEN_ITEMS.has(purchase.key),
          );

          return (
            <div
              key={player.player_slot}
              className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start"
            >
              <div
                className={cn(
                  "w-44 shrink-0 border-l-[3px] pl-2",
                  player.isRadiant ? "border-l-radiant" : "border-l-dire",
                )}
              >
                <HeroCell hero={heroes[player.hero_id]} />
              </div>
              {purchases.length === 0 ? (
                <p className="text-muted-foreground">No purchases recorded.</p>
              ) : (
                <ol className="flex flex-wrap gap-x-1.5 gap-y-2">
                  {purchases.map((purchase, index) => (
                    <li
                      // The same item can be bought twice at the same second
                      key={`${purchase.key}-${purchase.time}-${index}`}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <ItemIcon item={items[purchase.key]} />
                      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                        {formatGameTime(purchase.time)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
