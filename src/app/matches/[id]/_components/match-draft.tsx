import Image from "next/image";
import { HeroLink } from "@/components/entity-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeroConstant, Match, PickBan } from "@/lib/api/types";
import { heroImageUrl } from "@/lib/dota";
import { cn } from "@/lib/utils";

const RADIANT_TEAM = 0;

function DraftHero({
  pick,
  hero,
}: {
  pick: PickBan;
  hero: HeroConstant | undefined;
}) {
  return (
    <div className="flex w-16 flex-col items-center gap-1 sm:w-20">
      <div className="relative">
        {hero ? (
          <HeroLink id={hero.id} className="block">
            <Image
              src={heroImageUrl(hero.img)}
              alt={hero.localized_name}
              title={hero.localized_name}
              width={80}
              height={45}
              className={cn(
                "h-9 w-16 rounded-[2px] object-cover ring-1 ring-frame sm:h-[45px] sm:w-20",
                !pick.is_pick && "opacity-50 grayscale",
              )}
            />
          </HeroLink>
        ) : (
          <div className="h-9 w-16 rounded-[2px] bg-muted sm:h-[45px] sm:w-20" />
        )}
        {!pick.is_pick && (
          <span
            aria-hidden
            className="absolute inset-0 m-auto h-0.5 w-[110%] -translate-x-[5%] rotate-[-30deg] bg-dire/80"
          />
        )}
      </div>
      <span className="font-mono text-[10px] text-muted-foreground">
        #{pick.order + 1} {pick.is_pick ? "Pick" : "Ban"}
      </span>
    </div>
  );
}

export function MatchDraft({
  match,
  heroes,
}: {
  match: Match;
  heroes: Record<string, HeroConstant>;
}) {
  const draft = [...(match.picks_bans ?? [])].sort((a, b) => a.order - b.order);

  if (draft.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="py-6 text-center text-muted-foreground">
            This game mode has no draft.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {[RADIANT_TEAM, 1].map((team) => {
        const isRadiant = team === RADIANT_TEAM;
        const teamName =
          (isRadiant ? match.radiant_team : match.dire_team)?.name ??
          (isRadiant ? "Radiant" : "Dire");
        const entries = draft.filter((pick) => pick.team === team);

        return (
          <Card key={team}>
            <CardHeader>
              <CardTitle className={isRadiant ? "text-radiant" : "text-dire"}>
                {teamName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[true, false].map((isPick) => (
                <div key={String(isPick)}>
                  <p className="mb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                    {isPick ? "Picks" : "Bans"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entries
                      .filter((pick) => pick.is_pick === isPick)
                      .map((pick) => (
                        <DraftHero
                          key={pick.order}
                          pick={pick}
                          hero={heroes[pick.hero_id]}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
