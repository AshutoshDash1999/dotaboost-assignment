"use client";

import { useState } from "react";
import { LeagueLink } from "@/components/entity-link";
import { ListSearch } from "@/components/list-search";
import { PageHeader } from "@/components/page-header";
import { QueryError } from "@/components/query-error";
import { ShowMoreButton } from "@/components/show-more-button";
import { Stagger, StaggerItem } from "@/components/stagger";
import { TierBadge } from "@/components/tier-badge";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useShowMore } from "@/hooks/use-show-more";
import { useLeagues } from "@/lib/api/hooks";

// "excluded" leagues are ones OpenDota leaves out of pro stats
const TIERS = [
  { value: "premium", label: "Premium" },
  { value: "professional", label: "Professional" },
  { value: "amateur", label: "Amateur" },
];

export function LeagueList() {
  const leagues = useLeagues();
  const [query, setQuery] = useState("");
  const [tiers, setTiers] = useState<string[]>(["premium", "professional"]);

  const needle = query.trim().toLowerCase();
  const filtered = leagues.leagues
    .filter(
      (league) =>
        (tiers.length === 0 || tiers.includes(league.tier ?? "")) &&
        (!needle || league.name?.toLowerCase().includes(needle)),
    )
    // League IDs grow over time, so this puts recent events first
    .sort((a, b) => b.leagueid - a.leagueid);
  const list = useShowMore(filtered);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Stagger className="space-y-8">
        <StaggerItem>
          <PageHeader
            eyebrow="Pro scene · OpenDota"
            title="Leagues"
            description="Tournaments and leagues, newest first"
          />
        </StaggerItem>
        <StaggerItem className="flex flex-wrap items-center gap-2">
          <ListSearch
            value={query}
            onChange={(value) => {
              setQuery(value);
              list.reset();
            }}
            placeholder="Search leagues"
          />
          <ToggleGroup
            multiple
            variant="outline"
            size="sm"
            value={tiers}
            onValueChange={(value) => {
              setTiers(value);
              list.reset();
            }}
            aria-label="League tier"
          >
            {TIERS.map((tier) => (
              <ToggleGroupItem key={tier.value} value={tier.value}>
                {tier.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </StaggerItem>
      </Stagger>
      <div className="mt-6">
        {leagues.isError ? (
          <QueryError message="Couldn't load leagues." queries={[leagues]} />
        ) : leagues.isLoading ? (
          <div className="h-96 rounded-sm hud-skeleton" />
        ) : (
          <Card>
            <CardContent className="px-0">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">
                  No leagues match these filters.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {list.visible.map((league) => (
                    <li
                      key={league.leagueid}
                      className="flex items-center justify-between gap-3 px-(--card-spacing) py-2.5"
                    >
                      <LeagueLink
                        id={league.leagueid}
                        className="min-w-0 truncate font-medium"
                      >
                        {league.name || `League ${league.leagueid}`}
                      </LeagueLink>
                      <TierBadge tier={league.tier} />
                    </li>
                  ))}
                </ul>
              )}
              {list.hasMore && (
                <ShowMoreButton
                  remaining={list.remaining}
                  onClick={list.showMore}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
