"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { NotFoundPanel } from "@/components/not-found-panel";
import { isNotFound, QueryError } from "@/components/query-error";
import { StaggerItem, staggerContainer } from "@/components/stagger";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConstant, useHeroes, useItems, useMatch } from "@/lib/api/hooks";
import type { NamedConstant } from "@/lib/api/types";
import { MatchBuilds } from "./match-builds";
import { MatchChat } from "./match-chat";
import { MatchDraft } from "./match-draft";
import { MatchGraphs } from "./match-graphs";
import { MatchHeader } from "./match-header";
import { MatchSkeleton } from "./match-skeleton";
import { ParsePrompt } from "./parse-prompt";
import { Scoreboard } from "./scoreboard";

export function MatchDetails({ matchId }: { matchId: string }) {
  const router = useRouter();
  const matchQuery = useMatch(matchId);
  const heroes = useHeroes();
  const items = useItems();
  const gameModes = useConstant<Record<string, NamedConstant>>("game_mode");

  const queries = [matchQuery, heroes, items, gameModes];

  if (isNotFound(matchQuery.error)) {
    return (
      <NotFoundPanel
        title="Match not found"
        message="OpenDota has no record of this match."
      />
    );
  }

  if (queries.some((query) => query.isError)) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
        <QueryError message="Couldn't load this match." queries={queries} />
      </main>
    );
  }

  const match = matchQuery.match;
  if (!match || queries.some((query) => query.isLoading)) {
    return <MatchSkeleton />;
  }

  const isParsed = match.od_data?.has_parsed ?? false;
  const parsePrompt = <ParsePrompt matchId={matchId} />;

  return (
    <motion.main
      className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <title>{`Match ${match.match_id} · Dota stats`}</title>
      <StaggerItem>
        <Button
          variant="outline"
          size="sm"
          // Opened from a direct link there is no in-app page to go back to
          onClick={() =>
            window.history.length > 1 ? router.back() : router.push("/")
          }
        >
          <IconArrowLeft />
          Back
        </Button>
      </StaggerItem>
      <StaggerItem>
        <MatchHeader
          match={match}
          gameMode={gameModes.constant?.[match.game_mode]}
        />
      </StaggerItem>
      <StaggerItem>
        <Tabs defaultValue="overview">
          <TabsList className="max-w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="graphs">Graphs</TabsTrigger>
            <TabsTrigger value="builds">Builds</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4 space-y-6">
            {(["radiant", "dire"] as const).map((side) => (
              <Scoreboard
                key={side}
                side={side}
                match={match}
                heroes={heroes.heroes}
                items={items.itemsById}
              />
            ))}
          </TabsContent>
          <TabsContent value="draft" className="mt-4">
            <MatchDraft match={match} heroes={heroes.heroes} />
          </TabsContent>
          <TabsContent value="graphs" className="mt-4">
            {isParsed ? <MatchGraphs match={match} /> : parsePrompt}
          </TabsContent>
          <TabsContent value="builds" className="mt-4">
            {isParsed ? (
              <MatchBuilds
                match={match}
                heroes={heroes.heroes}
                items={items.itemsByName}
              />
            ) : (
              parsePrompt
            )}
          </TabsContent>
          <TabsContent value="chat" className="mt-4">
            {isParsed ? (
              <MatchChat match={match} heroes={heroes.heroes} />
            ) : (
              parsePrompt
            )}
          </TabsContent>
        </Tabs>
      </StaggerItem>
    </motion.main>
  );
}
