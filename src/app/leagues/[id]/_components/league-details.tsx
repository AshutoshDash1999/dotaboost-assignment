"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { TeamLink } from "@/components/entity-link";
import { NotFoundPanel } from "@/components/not-found-panel";
import { ProMatchTable } from "@/components/pro-match-table";
import { QueryError } from "@/components/query-error";
import { ShowMoreButton } from "@/components/show-more-button";
import { StaggerItem, staggerContainer } from "@/components/stagger";
import { TeamLogo } from "@/components/team-logo";
import { TierBadge } from "@/components/tier-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useShowMore } from "@/hooks/use-show-more";
import { useLeague, useLeagueMatches, useLeagueTeams } from "@/lib/api/hooks";

export function LeagueDetails({ leagueId }: { leagueId: string }) {
  const league = useLeague(leagueId);
  const matches = useLeagueMatches(leagueId);
  const teams = useLeagueTeams(leagueId);
  const list = useShowMore(matches.matches, 25);

  const queries = [league, matches, teams];

  if (queries.some((query) => query.isError)) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
        <QueryError message="Couldn't load this league." queries={queries} />
      </main>
    );
  }

  if (queries.some((query) => query.isLoading)) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6">
        <div className="h-8 w-24 rounded-sm hud-skeleton" />
        <div className="h-28 rounded-sm hud-skeleton" />
        <div className="h-96 rounded-sm hud-skeleton" />
      </main>
    );
  }

  if (!league.league) {
    return (
      <NotFoundPanel
        title="League not found"
        message="OpenDota has no record of this league."
      />
    );
  }

  // League matches carry team IDs but often no names
  const teamNames = Object.fromEntries(
    teams.teams.map((team) => [team.team_id, team.name]),
  );

  return (
    <motion.main
      className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <title>{`${league.league.name} · Dota stats`}</title>
      <StaggerItem>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/leagues" />}
        >
          <IconArrowLeft />
          All leagues
        </Button>
      </StaggerItem>
      <StaggerItem>
        <header className="overflow-hidden hud-panel p-5 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_0%_0%,var(--glow),transparent_70%)] opacity-50"
          />
          <div className="relative">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-muted-foreground uppercase">
                League {league.league.leagueid}
              </p>
              <TierBadge tier={league.league.tier} />
            </div>
            <h1 className="mt-1 font-heading text-3xl font-bold tracking-wide sm:text-4xl">
              {league.league.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {matches.matches.length} matches · {teams.teams.length} teams
            </p>
          </div>
        </header>
      </StaggerItem>
      <StaggerItem className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Matches</CardTitle>
            <CardDescription>Most recent first</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {matches.matches.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground">
                No matches recorded.
              </p>
            ) : (
              <ProMatchTable
                matches={list.visible}
                showLeague={false}
                teamNames={teamNames}
              />
            )}
            {list.hasMore && (
              <ShowMoreButton
                remaining={list.remaining}
                onClick={list.showMore}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Teams</CardTitle>
          </CardHeader>
          <CardContent>
            {teams.teams.length === 0 ? (
              <p className="text-muted-foreground">No teams recorded.</p>
            ) : (
              <ul className="space-y-2">
                {teams.teams.map((team) => (
                  <li key={team.team_id} className="flex items-center gap-2.5">
                    <TeamLogo url={team.logo_url} />
                    <TeamLink id={team.team_id} className="min-w-0 truncate">
                      {team.name || `Team ${team.team_id}`}
                    </TeamLink>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </StaggerItem>
    </motion.main>
  );
}
