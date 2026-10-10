import { LeagueLink, MatchLink, TeamLink } from "@/components/entity-link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProMatch } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { formatDuration } from "@/lib/dota";
import { cn } from "@/lib/utils";

function TeamName({
  id,
  name,
  fallback,
  won,
}: {
  id: number | null | undefined;
  name: string | null | undefined;
  fallback: string;
  won: boolean;
}) {
  const className = cn(
    "relative z-10 block max-w-40 truncate",
    won ? "font-semibold text-foreground" : "text-muted-foreground",
  );
  const label = name || fallback;

  return id ? (
    <TeamLink id={id} className={className}>
      {label}
    </TeamLink>
  ) : (
    <span className={className}>{label}</span>
  );
}

// Inner team and league links sit above the stretched match link (z-10)
export function ProMatchTable({
  matches,
  showLeague = true,
  teamNames = {},
}: {
  matches: ProMatch[];
  showLeague?: boolean;
  // Fills in names the endpoint leaves out, keyed by team ID
  teamNames?: Record<number, string>;
}) {
  return (
    <Table className="tabular-nums">
      <TableHeader className="text-[11px] tracking-wider uppercase">
        <TableRow className="border-frame hover:bg-transparent">
          <TableHead className="pl-(--card-spacing) text-right">
            Radiant
          </TableHead>
          <TableHead className="text-center">Score</TableHead>
          <TableHead>Dire</TableHead>
          {showLeague && (
            <TableHead className="hidden md:table-cell">League</TableHead>
          )}
          <TableHead className="hidden sm:table-cell">Duration</TableHead>
          <TableHead className="pr-(--card-spacing)">Played</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={match.match_id} className="relative">
            <TableCell className="pl-(--card-spacing)">
              <div className="flex justify-end">
                <TeamName
                  id={match.radiant_team_id}
                  name={
                    match.radiant_name ??
                    (match.radiant_team_id
                      ? teamNames[match.radiant_team_id]
                      : undefined)
                  }
                  fallback="Radiant"
                  won={match.radiant_win}
                />
              </div>
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
              <MatchLink
                id={match.match_id}
                aria-label={`Match ${match.match_id}`}
                className="font-heading font-bold after:absolute after:inset-0"
              >
                <span className="text-radiant">{match.radiant_score}</span>
                <span className="mx-1.5 text-muted-foreground">:</span>
                <span className="text-dire">{match.dire_score}</span>
              </MatchLink>
            </TableCell>
            <TableCell>
              <TeamName
                id={match.dire_team_id}
                name={
                  match.dire_name ??
                  (match.dire_team_id
                    ? teamNames[match.dire_team_id]
                    : undefined)
                }
                fallback="Dire"
                won={!match.radiant_win}
              />
            </TableCell>
            {showLeague && (
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
            )}
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
