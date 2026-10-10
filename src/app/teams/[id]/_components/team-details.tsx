"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { NotFoundPanel } from "@/components/not-found-panel";
import { QueryError } from "@/components/query-error";
import { StaggerItem, staggerContainer } from "@/components/stagger";
import { winRateColor } from "@/components/stat-tile";
import { TeamLogo } from "@/components/team-logo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeam } from "@/lib/api/hooks";
import { dayjs } from "@/lib/dayjs";
import { formatPercent, winRate } from "@/lib/dota";
import { cn } from "@/lib/utils";
import { TeamHeroes } from "./team-heroes";
import { TeamMatches } from "./team-matches";
import { TeamPlayers } from "./team-players";

export function TeamDetails({ teamId }: { teamId: string }) {
  const query = useTeam(teamId);

  if (query.isError) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
        <QueryError message="Couldn't load this team." queries={[query]} />
      </main>
    );
  }

  if (query.isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6">
        <div className="h-8 w-24 rounded-sm hud-skeleton" />
        <div className="h-36 rounded-sm hud-skeleton" />
        <div className="h-96 rounded-sm hud-skeleton" />
      </main>
    );
  }

  const team = query.team;
  if (!team) {
    return (
      <NotFoundPanel
        title="Team not found"
        message="OpenDota has no record of this team."
      />
    );
  }

  const rate = winRate(team.wins, team.wins + team.losses);
  const stats = [
    {
      label: "Rating",
      value: team.rating ? Math.round(team.rating) : "—",
      className: "text-gold",
    },
    { label: "Wins / losses", value: `${team.wins} / ${team.losses}` },
    {
      label: "Win rate",
      value: formatPercent(rate),
      className: winRateColor(rate),
    },
    {
      label: "Last match",
      value: team.last_match_time
        ? dayjs.unix(team.last_match_time).fromNow()
        : "—",
    },
  ];

  return (
    <motion.main
      className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <title>{`${team.name} · Dota stats`}</title>
      <StaggerItem>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/teams" />}
        >
          <IconArrowLeft />
          All teams
        </Button>
      </StaggerItem>
      <StaggerItem>
        <header className="overflow-hidden hud-panel">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_0%_0%,var(--glow),transparent_70%)] opacity-50"
          />
          <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
            <TeamLogo
              url={team.logo_url}
              size={96}
              className="size-16 sm:size-24"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-muted-foreground uppercase">
                Team{team.tag ? ` · ${team.tag}` : ""}
              </p>
              <h1 className="mt-1 truncate font-heading text-3xl font-bold tracking-wide sm:text-4xl">
                {team.name}
              </h1>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-[11px] tracking-wider text-muted-foreground uppercase">
                      {stat.label}
                    </dt>
                    <dd
                      className={cn(
                        "text-lg font-bold tabular-nums",
                        stat.className,
                      )}
                    >
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>
      </StaggerItem>
      <StaggerItem>
        <Tabs defaultValue="matches">
          <TabsList>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="heroes">Heroes</TabsTrigger>
          </TabsList>
          <TabsContent value="matches" className="mt-4">
            <TeamMatches teamId={teamId} />
          </TabsContent>
          <TabsContent value="players" className="mt-4">
            <TeamPlayers teamId={teamId} />
          </TabsContent>
          <TabsContent value="heroes" className="mt-4">
            <TeamHeroes teamId={teamId} />
          </TabsContent>
        </Tabs>
      </StaggerItem>
    </motion.main>
  );
}
