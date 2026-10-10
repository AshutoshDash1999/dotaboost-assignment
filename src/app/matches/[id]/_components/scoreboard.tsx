import Image from "next/image";
import { PlayerLink } from "@/components/entity-link";
import { ItemIcon } from "@/components/item-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  HeroConstant,
  ItemConstant,
  Match,
  MatchPlayer,
} from "@/lib/api/types";
import { formatCompact, heroImageUrl } from "@/lib/dota";
import { cn } from "@/lib/utils";

const ITEM_SLOTS = [
  "item_0",
  "item_1",
  "item_2",
  "item_3",
  "item_4",
  "item_5",
] as const;

function PlayerCell({
  player,
  hero,
}: {
  player: MatchPlayer;
  hero: HeroConstant | undefined;
}) {
  const name = player.name ?? player.personaname ?? "Anonymous";

  return (
    <div className="flex items-center gap-2.5">
      {hero ? (
        <Image
          src={heroImageUrl(hero.img)}
          alt=""
          width={48}
          height={27}
          className="h-[27px] w-12 shrink-0 rounded-[2px] object-cover ring-1 ring-frame"
        />
      ) : (
        <div className="h-[27px] w-12 shrink-0 rounded-[2px] bg-muted ring-1 ring-frame" />
      )}
      <div className="min-w-0">
        {player.account_id ? (
          <PlayerLink
            id={player.account_id}
            className="block max-w-36 truncate font-medium"
          >
            {name}
          </PlayerLink>
        ) : (
          <span className="block max-w-36 truncate font-medium text-muted-foreground">
            {name}
          </span>
        )}
        <span className="block truncate text-xs text-muted-foreground">
          {hero?.localized_name ?? "Unknown hero"}
        </span>
      </div>
    </div>
  );
}

export function Scoreboard({
  side,
  match,
  heroes,
  items,
}: {
  side: "radiant" | "dire";
  match: Match;
  heroes: Record<string, HeroConstant>;
  items: Record<string, ItemConstant>;
}) {
  const isRadiant = side === "radiant";
  const players = match.players.filter((p) => p.isRadiant === isRadiant);
  const won = match.radiant_win === isRadiant;
  const teamName =
    (isRadiant ? match.radiant_team : match.dire_team)?.name ??
    (isRadiant ? "Radiant" : "Dire");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className={isRadiant ? "text-radiant" : "text-dire"}>
            {teamName}
          </span>
          {won && (
            <span className="rounded-sm border border-gold/50 bg-gold/15 px-1.5 py-0.5 font-heading text-[10px] font-bold tracking-wider text-gold uppercase">
              Winner
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table className="tabular-nums">
          <TableHeader className="text-[11px] tracking-wider uppercase">
            <TableRow className="border-frame hover:bg-transparent">
              <TableHead className="pl-(--card-spacing)">Player</TableHead>
              <TableHead>Lvl</TableHead>
              <TableHead>K / D / A</TableHead>
              <TableHead>LH / DN</TableHead>
              <TableHead>Net worth</TableHead>
              <TableHead>GPM / XPM</TableHead>
              <TableHead>Damage</TableHead>
              <TableHead className="pr-(--card-spacing)">Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow
                key={player.player_slot}
                className={cn(isRadiant ? "bg-radiant/5" : "bg-dire/5")}
              >
                <TableCell
                  className={cn(
                    "border-l-[3px] pl-[calc(var(--card-spacing)-3px)]",
                    isRadiant ? "border-l-radiant" : "border-l-dire",
                  )}
                >
                  <PlayerCell player={player} hero={heroes[player.hero_id]} />
                </TableCell>
                <TableCell>{player.level}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {player.kills} / {player.deaths} / {player.assists}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {player.last_hits} / {player.denies}
                </TableCell>
                <TableCell className="text-gold">
                  {player.net_worth ? formatCompact(player.net_worth) : "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {player.gold_per_min} / {player.xp_per_min}
                </TableCell>
                <TableCell>
                  {player.hero_damage ? formatCompact(player.hero_damage) : "—"}
                </TableCell>
                <TableCell className="pr-(--card-spacing)">
                  <div className="flex items-center gap-1">
                    {ITEM_SLOTS.map((slot) => (
                      <ItemIcon key={slot} item={items[player[slot]]} />
                    ))}
                    {player.item_neutral ? (
                      <ItemIcon
                        item={items[player.item_neutral]}
                        className="ml-1 w-6 rounded-full"
                      />
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
