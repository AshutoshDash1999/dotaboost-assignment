import { HeroCell } from "@/components/hero-cell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeroConstant, Match } from "@/lib/api/types";
import { formatGameTime, isRadiantSlot } from "@/lib/dota";
import { cn } from "@/lib/utils";

export function MatchChat({
  match,
  heroes,
}: {
  match: Match;
  heroes: Record<string, HeroConstant>;
}) {
  // Chat wheel lines are phrase IDs; only typed messages are readable
  const messages = (match.chat ?? []).filter((entry) => entry.type === "chat");
  const heroBySlot = new Map(
    match.players.map((player) => [player.player_slot, player.hero_id]),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All chat</CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            Nobody typed in chat this game.
          </p>
        ) : (
          <ol className="space-y-2">
            {messages.map((message, index) => {
              const slot = message.player_slot ?? 0;
              return (
                <li
                  key={`${message.time}-${index}`}
                  className={cn(
                    "flex items-center gap-3 border-l-[3px] pl-2",
                    isRadiantSlot(slot) ? "border-l-radiant" : "border-l-dire",
                  )}
                >
                  <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {formatGameTime(message.time)}
                  </span>
                  <div className="w-40 shrink-0">
                    <HeroCell hero={heroes[heroBySlot.get(slot) ?? -1]} />
                  </div>
                  <p className="min-w-0 break-words">{message.key}</p>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
