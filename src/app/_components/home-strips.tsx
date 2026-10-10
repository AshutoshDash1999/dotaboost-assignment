"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeroCell } from "@/components/hero-cell";
import { LiveGameCard } from "@/components/live-game-card";
import { ProMatchTable } from "@/components/pro-match-table";
import { SectionHeading } from "@/components/section-heading";
import { winRateColor } from "@/components/stat-tile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useHeroes,
  useHeroStats,
  useLiveGames,
  useProMatchesFeed,
} from "@/lib/api/hooks";
import { formatPercent, winRate } from "@/lib/dota";
import { sortLiveGames } from "@/lib/live";
import { cn } from "@/lib/utils";

const LIVE_GAMES = 2;
const PRO_MATCHES = 5;
const META_HEROES = 5;
// Heroes in fewer matches than this have noisy win rates
const MIN_PICK_RATE = 0.01;

function Strip({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href: string;
  linkLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <SectionHeading
        title={title}
        aside={
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={href} />}
          >
            {linkLabel}
            <IconArrowRight />
          </Button>
        }
      />
      {children}
    </section>
  );
}

function LiveStrip() {
  const live = useLiveGames();
  const heroes = useHeroes();
  const games = sortLiveGames(live.games).slice(0, LIVE_GAMES);

  if (live.isError || (!live.isLoading && games.length === 0)) return null;

  return (
    <Strip title="Live now" href="/live" linkLabel="All live games">
      {live.isLoading ? (
        <div className="h-32 rounded-sm hud-skeleton" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {games.map((game) => (
            <LiveGameCard
              key={game.match_id}
              game={game}
              heroes={heroes.heroes}
            />
          ))}
        </div>
      )}
    </Strip>
  );
}

function ProStrip() {
  const feed = useProMatchesFeed();

  if (feed.isError) return null;

  return (
    <Strip title="Latest pro matches" href="/matches" linkLabel="All matches">
      {feed.isLoading ? (
        <div className="h-48 rounded-sm hud-skeleton" />
      ) : (
        <Card>
          <CardContent className="px-0">
            <ProMatchTable matches={feed.matches.slice(0, PRO_MATCHES)} />
          </CardContent>
        </Card>
      )}
    </Strip>
  );
}

function MetaStrip() {
  const heroStats = useHeroStats();

  if (heroStats.isError) return null;

  // Ten picks per match
  const matches =
    heroStats.heroStats.reduce((sum, hero) => sum + hero.pub_pick, 0) / 10;
  const top = heroStats.heroStats
    .filter((hero) => hero.pub_pick >= matches * MIN_PICK_RATE)
    .map((hero) => ({ hero, rate: winRate(hero.pub_win, hero.pub_pick) }))
    .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))
    .slice(0, META_HEROES);

  return (
    <Strip title="Strongest heroes" href="/heroes" linkLabel="Hero meta">
      {heroStats.isLoading ? (
        <div className="h-24 rounded-sm hud-skeleton" />
      ) : (
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {top.map(({ hero, rate }) => (
            <li
              key={hero.id}
              className="flex items-center justify-between gap-2 hud-panel px-3 py-2"
            >
              <div className="min-w-0">
                <HeroCell hero={hero} linked />
              </div>
              <span
                className={cn(
                  "shrink-0 text-sm tabular-nums",
                  winRateColor(rate),
                )}
              >
                {formatPercent(rate)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Strip>
  );
}

export function HomeStrips() {
  return (
    <div className="mt-14 space-y-14">
      <LiveStrip />
      <ProStrip />
      <MetaStrip />
    </div>
  );
}
