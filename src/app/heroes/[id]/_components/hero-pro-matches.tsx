"use client";

import { MatchLink } from "@/components/entity-link";
import { ResultBadge } from "@/components/result-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHeroMatches } from "@/lib/api/hooks";
import { dayjs } from "@/lib/dayjs";
import { formatDuration } from "@/lib/dota";
import { cn } from "@/lib/utils";
import { tabPlaceholder } from "./tab-placeholder";

export function HeroProMatches({ heroId }: { heroId: string }) {
  const matches = useHeroMatches(heroId);

  const placeholder = tabPlaceholder([matches], "Couldn't load pro matches.");
  if (placeholder) return placeholder;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pro matches</CardTitle>
        <CardDescription>
          Recent professional games with this hero
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {matches.matches.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No recent pro matches.
          </p>
        ) : (
          <Table className="tabular-nums">
            <TableHeader className="text-[11px] tracking-wider uppercase">
              <TableRow className="border-frame hover:bg-transparent">
                <TableHead className="pl-(--card-spacing)">League</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>K / D / A</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="pr-(--card-spacing)">Played</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.matches.map((match) => {
                // Result from the side this hero was on
                const won = match.radiant === match.radiant_win;
                return (
                  <TableRow
                    key={`${match.match_id}-${match.account_id}`}
                    className={cn(
                      "relative",
                      won ? "bg-radiant/5" : "bg-dire/5",
                    )}
                  >
                    <TableCell
                      className={cn(
                        "max-w-64 border-l-[3px] pl-[calc(var(--card-spacing)-3px)]",
                        won ? "border-l-radiant" : "border-l-dire",
                      )}
                    >
                      {/* Stretched link: the whole row opens the match */}
                      <MatchLink
                        id={match.match_id}
                        className="block truncate font-medium after:absolute after:inset-0"
                      >
                        {match.league_name || `Match ${match.match_id}`}
                      </MatchLink>
                    </TableCell>
                    <TableCell>
                      <ResultBadge won={won} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {match.kills} / {match.deaths} / {match.assists}
                    </TableCell>
                    <TableCell>{formatDuration(match.duration)}</TableCell>
                    <TableCell className="pr-(--card-spacing) whitespace-nowrap text-muted-foreground">
                      {dayjs.unix(match.start_time).fromNow()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
