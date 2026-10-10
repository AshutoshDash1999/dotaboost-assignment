"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MatchLink } from "@/components/entity-link";
import { HeroCell } from "@/components/hero-cell";
import { QueryError } from "@/components/query-error";
import { ResultBadge } from "@/components/result-badge";
import { Button } from "@/components/ui/button";
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
import {
  useConstant,
  useHeroes,
  usePlayerMatches,
  usePlayerWinLoss,
} from "@/lib/api/hooks";
import type { NamedConstant } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { formatConstantName, formatDuration, isWin } from "@/lib/dota";
import { getRankLabel } from "@/lib/rank";
import { cn } from "@/lib/utils";
import { usePlayerFilters } from "../_hooks/use-player-filters";
import { PlayerTabSkeleton } from "./player-skeleton";

const PAGE_SIZE = 20;

export function PlayerMatches({ accountId }: { accountId: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { filters } = usePlayerFilters();
  const page = Math.max(0, Number(searchParams.get("page") ?? 1) - 1) || 0;

  const matches = usePlayerMatches(accountId, filters, page, PAGE_SIZE);
  // The matches endpoint has no total; W/L with the same filters gives one
  const winLoss = usePlayerWinLoss(accountId, filters);
  const heroes = useHeroes();
  const gameModes = useConstant<Record<string, NamedConstant>>("game_mode");

  const queries = [matches, winLoss, heroes, gameModes];

  if (queries.some((query) => query.isError)) {
    return <QueryError message="Couldn't load matches." queries={queries} />;
  }

  if (queries.some((query) => query.isLoading)) return <PlayerTabSkeleton />;

  const total = winLoss.winLoss.win + winLoss.winLoss.lose;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (target: number) => {
    const params = new URLSearchParams(searchParams);
    if (target === 0) params.delete("page");
    else params.set("page", String(target + 1));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match history</CardTitle>
        <CardDescription>
          {total.toLocaleString()} matches · page {page + 1} of {pageCount}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {matches.matches.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No matches for these filters.
          </p>
        ) : (
          <Table
            className={cn(
              "tabular-nums transition-opacity",
              matches.isPlaceholderData && "opacity-60",
            )}
          >
            <TableHeader className="text-[11px] tracking-wider uppercase">
              <TableRow className="border-frame hover:bg-transparent">
                <TableHead className="pl-(--card-spacing)">Hero</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>K / D / A</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="hidden md:table-cell">Mode</TableHead>
                <TableHead className="hidden md:table-cell">Avg rank</TableHead>
                <TableHead className="pr-(--card-spacing)">Played</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.matches.map((match) => {
                const won = isWin(match);
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
                      {/* Stretched link: the whole row opens the match */}
                      <MatchLink
                        id={match.match_id}
                        aria-label={`Match ${match.match_id}`}
                        className="after:absolute after:inset-0"
                      >
                        <HeroCell hero={heroes.heroes[match.hero_id]} />
                      </MatchLink>
                    </TableCell>
                    <TableCell>
                      <ResultBadge won={won} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {match.kills} / {match.deaths} / {match.assists}
                    </TableCell>
                    <TableCell>{formatDuration(match.duration)}</TableCell>
                    <TableCell className="hidden whitespace-nowrap md:table-cell">
                      {formatConstantName(
                        gameModes.constant?.[match.game_mode]?.name,
                        "game_mode_",
                      )}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-muted-foreground md:table-cell">
                      {match.average_rank
                        ? getRankLabel(match.average_rank)
                        : "—"}
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
        {pageCount > 1 && (
          <nav
            aria-label="Pagination"
            className="flex items-center justify-between gap-3 px-(--card-spacing) pt-4"
          >
            <Button
              variant="outline"
              size="sm"
              aria-disabled={page === 0}
              nativeButton={false}
              render={<Link href={pageHref(page - 1)} scroll={false} />}
              className={cn(page === 0 && "pointer-events-none opacity-50")}
            >
              <IconChevronLeft />
              Newer
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              {page + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              aria-disabled={page + 1 >= pageCount}
              nativeButton={false}
              render={<Link href={pageHref(page + 1)} scroll={false} />}
              className={cn(
                page + 1 >= pageCount && "pointer-events-none opacity-50",
              )}
            >
              Older
              <IconChevronRight />
            </Button>
          </nav>
        )}
      </CardContent>
    </Card>
  );
}
