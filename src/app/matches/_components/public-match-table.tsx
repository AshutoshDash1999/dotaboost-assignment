import { MatchLink } from "@/components/entity-link";
import { HeroLineup } from "@/components/hero-lineup";
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
import { formatDuration } from "@/lib/dota";
import { getRankLabel } from "@/lib/rank";

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
                <HeroLineup
                  heroIds={match.radiant_team}
                  heroes={heroes}
                  won={match.radiant_win}
                />
              </MatchLink>
            </TableCell>
            <TableCell>
              <HeroLineup
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
