"use client";

import { LeagueLink, MatchLink, TeamLink } from "@/components/entity-link";
import { QueryError } from "@/components/query-error";
import { ResultBadge } from "@/components/result-badge";
import { ShowMoreButton } from "@/components/show-more-button";
import { TeamLogo } from "@/components/team-logo";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShowMore } from "@/hooks/use-show-more";
import { useTeamMatches } from "@/lib/api/hooks";
import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/utils";

export function TeamMatches({ teamId }: { teamId: string }) {
  const query = useTeamMatches(teamId);
  const list = useShowMore(query.matches, 25);

  if (query.isError) {
    return <QueryError message="Couldn't load matches." queries={[query]} />;
  }
  if (query.isLoading) return <div className="h-96 rounded-sm hud-skeleton" />;

  return (
    <Card>
      <CardContent className="px-0">
        {query.matches.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No matches recorded.
          </p>
        ) : (
          <Table className="tabular-nums">
            <TableHeader className="text-[11px] tracking-wider uppercase">
              <TableRow className="border-frame hover:bg-transparent">
                <TableHead className="pl-(--card-spacing)">Opponent</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="hidden md:table-cell">League</TableHead>
                <TableHead className="pr-(--card-spacing)">Played</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.visible.map((match) => {
                const won = match.radiant === match.radiant_win;
                const [own, opponent] = match.radiant
                  ? [match.radiant_score, match.dire_score]
                  : [match.dire_score, match.radiant_score];
                return (
                  <TableRow
                    key={match.match_id}
                    className={cn(
                      "relative",
                      won ? "bg-radiant/5" : "bg-dire/5",
                    )}
                  >
                    <TableCell
                      className={cn(
                        "border-l-[3px] pl-[calc(var(--card-spacing)-3px)]",
                        won ? "border-l-radiant" : "border-l-dire",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <TeamLogo url={match.opposing_team_logo} />
                        {match.opposing_team_id ? (
                          <TeamLink
                            id={match.opposing_team_id}
                            className="relative z-10 max-w-44 truncate font-medium"
                          >
                            {match.opposing_team_name || "Unknown team"}
                          </TeamLink>
                        ) : (
                          <span className="text-muted-foreground">
                            Unknown team
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ResultBadge won={won} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {/* Stretched link: the whole row opens the match */}
                      <MatchLink
                        id={match.match_id}
                        aria-label={`Match ${match.match_id}`}
                        className="font-heading font-bold after:absolute after:inset-0"
                      >
                        {own} : {opponent}
                      </MatchLink>
                    </TableCell>
                    <TableCell className="hidden max-w-56 md:table-cell">
                      {match.leagueid ? (
                        <LeagueLink
                          id={match.leagueid}
                          className="relative z-10 block truncate text-muted-foreground"
                        >
                          {match.league_name || `League ${match.leagueid}`}
                        </LeagueLink>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="pr-(--card-spacing) whitespace-nowrap text-muted-foreground">
                      {dayjs.unix(match.start_time).fromNow()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        {list.hasMore && (
          <ShowMoreButton remaining={list.remaining} onClick={list.showMore} />
        )}
      </CardContent>
    </Card>
  );
}
