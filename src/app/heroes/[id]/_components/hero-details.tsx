"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { NotFoundPanel } from "@/components/not-found-panel";
import { QueryError } from "@/components/query-error";
import { StaggerItem, staggerContainer } from "@/components/stagger";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHeroStats } from "@/lib/api/hooks";
import { HeroBenchmarks } from "./hero-benchmarks";
import { HeroHeader } from "./hero-header";
import { HeroItems } from "./hero-items";
import { HeroMatchups } from "./hero-matchups";
import { HeroOverview } from "./hero-overview";
import { HeroPlayers } from "./hero-players";
import { HeroProMatches } from "./hero-pro-matches";

// Inactive tab panels unmount, so each tab only fetches once it's opened
const TABS = [
  { value: "overview", label: "Overview" },
  { value: "matchups", label: "Matchups" },
  { value: "items", label: "Items" },
  { value: "benchmarks", label: "Benchmarks" },
  { value: "players", label: "Top players" },
  { value: "matches", label: "Pro matches" },
];

export function HeroDetails({ heroId }: { heroId: string }) {
  const heroStats = useHeroStats();

  if (heroStats.isError) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
        <QueryError message="Couldn't load this hero." queries={[heroStats]} />
      </main>
    );
  }

  if (heroStats.isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6">
        <div className="h-8 w-24 rounded-sm hud-skeleton" />
        <div className="h-40 rounded-sm hud-skeleton" />
        <div className="h-96 rounded-sm hud-skeleton" />
      </main>
    );
  }

  const hero = heroStats.heroStats.find((h) => String(h.id) === heroId);
  if (!hero) {
    return (
      <NotFoundPanel
        title="Hero not found"
        message="There's no hero with this ID."
      />
    );
  }

  return (
    <motion.main
      className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <title>{`${hero.localized_name} · Dota stats`}</title>
      <StaggerItem>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/heroes" />}
        >
          <IconArrowLeft />
          All heroes
        </Button>
      </StaggerItem>
      <StaggerItem>
        <HeroHeader hero={hero} />
      </StaggerItem>
      <StaggerItem>
        <Tabs defaultValue="overview">
          <TabsList className="max-w-full justify-start overflow-x-auto">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <HeroOverview hero={hero} />
          </TabsContent>
          <TabsContent value="matchups" className="mt-4">
            <HeroMatchups heroId={heroId} />
          </TabsContent>
          <TabsContent value="items" className="mt-4">
            <HeroItems heroId={heroId} />
          </TabsContent>
          <TabsContent value="benchmarks" className="mt-4">
            <HeroBenchmarks heroId={heroId} />
          </TabsContent>
          <TabsContent value="players" className="mt-4">
            <HeroPlayers heroId={heroId} />
          </TabsContent>
          <TabsContent value="matches" className="mt-4">
            <HeroProMatches heroId={heroId} />
          </TabsContent>
        </Tabs>
      </StaggerItem>
    </motion.main>
  );
}
