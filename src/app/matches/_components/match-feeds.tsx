"use client";

import { IconLoader2 } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ProMatchTable } from "@/components/pro-match-table";
import { QueryError } from "@/components/query-error";
import { Stagger, StaggerItem } from "@/components/stagger";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useHeroes,
  useProMatchesFeed,
  usePublicMatchesFeed,
} from "@/lib/api/hooks";
import { RANK_BRACKETS } from "@/lib/hero-stats";
import { PublicMatchTable } from "./public-match-table";

type Feed = {
  isError: boolean;
  isLoading: boolean;
  refetch: () => unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

function FeedCard({
  feed,
  isEmpty,
  children,
}: {
  feed: Feed;
  isEmpty: boolean;
  children: ReactNode;
}) {
  if (feed.isError) {
    return <QueryError message="Couldn't load matches." queries={[feed]} />;
  }
  if (feed.isLoading) return <div className="h-96 rounded-sm hud-skeleton" />;

  return (
    <Card>
      <CardContent className="px-0">
        {isEmpty ? (
          <p className="py-6 text-center text-muted-foreground">
            No matches right now.
          </p>
        ) : (
          children
        )}
        {feed.hasNextPage && (
          <div className="flex justify-center px-(--card-spacing) pt-4">
            <Button
              variant="outline"
              disabled={feed.isFetchingNextPage}
              onClick={() => feed.fetchNextPage()}
            >
              {feed.isFetchingNextPage && (
                <IconLoader2 className="animate-spin" />
              )}
              Load older matches
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProFeed() {
  const feed = useProMatchesFeed();
  return (
    <FeedCard feed={feed} isEmpty={feed.matches.length === 0}>
      <ProMatchTable matches={feed.matches} />
    </FeedCard>
  );
}

function PublicFeed() {
  const [bracket, setBracket] = useState<string | null>(null);
  const tier = bracket ? Number(bracket) * 10 : undefined;
  // rank_tier spans 10–15 for Herald, 20–25 for Guardian and so on
  const feed = usePublicMatchesFeed(
    tier,
    tier === undefined ? undefined : tier + 5,
  );
  const heroes = useHeroes();
  // Games still in progress come back with no duration
  const finished = feed.matches.filter((match) => match.duration > 0);

  const items = [
    { value: null, label: "Any rank" },
    ...RANK_BRACKETS.map((b) => ({ value: b.value, label: b.label })),
  ];

  return (
    <div className="space-y-4">
      <Select items={items} value={bracket} onValueChange={setBracket}>
        <SelectTrigger
          size="sm"
          aria-label="Average rank"
          className="rounded-sm"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value ?? "any"} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FeedCard feed={feed} isEmpty={finished.length === 0}>
        <PublicMatchTable matches={finished} heroes={heroes.heroes} />
      </FeedCard>
    </div>
  );
}

export function MatchFeeds() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Stagger className="space-y-8">
        <StaggerItem>
          <PageHeader
            eyebrow="Match feed · OpenDota"
            title="Matches"
            description="The latest professional and public games"
          />
        </StaggerItem>
        <StaggerItem>
          <Tabs defaultValue="pro">
            <TabsList>
              <TabsTrigger value="pro">Pro</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
            </TabsList>
            <TabsContent value="pro" className="mt-4">
              <ProFeed />
            </TabsContent>
            <TabsContent value="public" className="mt-4">
              <PublicFeed />
            </TabsContent>
          </Tabs>
        </StaggerItem>
      </Stagger>
    </main>
  );
}
