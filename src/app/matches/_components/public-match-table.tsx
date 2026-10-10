import Image from "next/image";
import { MatchLink } from "@/components/entity-link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { HeroConstant, PublicMatch } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { formatDuration, heroImageUrl } from "@/lib/dota";
import { getRankLabel } from "@/lib/rank";
import { cn } from "@/lib/utils";

function Lineup({
  heroIds,
  heroes,
  won,
}: {
  heroIds: number[];
  heroes: Record<string, HeroConstant>;
  won: boolean;
}) {
  return (
    <div className={cn("flex gap-0.5", !won && "opacity-60")}>
      {heroIds.map((heroId, index) => {
        const hero = heroes[heroId];
        return hero ? (
          <Image
            // biome-ignore lint/suspicious/noArrayIndexKey: lineup slots are fixed positions
            key={index}
            src={heroImageUrl(hero.img)}
            alt={hero.localized_name}
            title={hero.localized_name}
            width={36}
            height={20}
            className="h-5 w-9 rounded-[2px] object-cover ring-1 ring-frame"
          />
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: lineup slots are fixed positions
          <div key={index} className="h-5 w-9 rounded-[2px] bg-muted" />
        );
      })}
    </div>
  );
}

export function PublicMatchTable({
  matches,
  heroes,
}: {
  matches: PublicMatch[];
  heroes: Record<string, HeroConstant>;
}) {
  return (
    <Table className="tabular-nums">
      <TableHeader className="text-[11px] tracking-wider uppercase">
        <TableRow className="border-frame hover:bg-transparent">
          <TableHead className="pl-(--card-spacing)">Radiant</TableHead>
          <TableHead>Dire</TableHead>
          <TableHead className="hidden md:table-cell">Avg rank</TableHead>
          <TableHead className="hidden sm:table-cell">Duration</TableHead>
          <TableHead className="pr-(--card-spacing)">Played</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={match.match_id} className="relative">
            <TableCell className="pl-(--card-spacing)">
              {/* Stretched link: the whole row opens the match */}
              <MatchLink
                id={match.match_id}
                aria-label={`Match ${match.match_id}`}
                className="block after:absolute after:inset-0"
              >
                <Lineup
                  heroIds={match.radiant_team}
                  heroes={heroes}
                  won={match.radiant_win}
                />
              </MatchLink>
            </TableCell>
            <TableCell>
              <Lineup
                heroIds={match.dire_team}
                heroes={heroes}
                won={!match.radiant_win}
              />
            </TableCell>
            <TableCell className="hidden whitespace-nowrap text-muted-foreground md:table-cell">
              {match.avg_rank_tier ? getRankLabel(match.avg_rank_tier) : "—"}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {formatDuration(match.duration)}
            </TableCell>
            <TableCell className="pr-(--card-spacing) whitespace-nowrap text-muted-foreground">
              {dayjs.unix(match.start_time).fromNow()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
