"use client";

import { IconLayoutGrid, IconList } from "@tabler/icons-react";
import { useState } from "react";
import { ListSearch } from "@/components/list-search";
import { PageHeader } from "@/components/page-header";
import { QueryError } from "@/components/query-error";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem } from "@/components/stagger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useHeroStats } from "@/lib/api/hooks";
import { winRate } from "@/lib/dota";
import {
  ATTRIBUTES,
  BRACKETS,
  type Bracket,
  bracketStats,
} from "@/lib/hero-stats";
import { HeroGrid } from "./hero-grid";
import { type HeroRow, HeroTable } from "./hero-table";

const ROLES = [
  "Carry",
  "Support",
  "Nuker",
  "Disabler",
  "Initiator",
  "Durable",
  "Escape",
  "Pusher",
];

export function HeroMeta() {
  const heroStats = useHeroStats();
  const [query, setQuery] = useState("");
  const [attribute, setAttribute] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [bracket, setBracket] = useState<Bracket>("pub");
  const [view, setView] = useState<"table" | "grid">("table");

  const totalPicks = heroStats.heroStats.reduce(
    (sum, hero) => sum + bracketStats(hero, bracket).picks,
    0,
  );

  const rows: HeroRow[] = heroStats.heroStats
    .filter(
      (hero) =>
        hero.localized_name
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (!attribute || hero.primary_attr === attribute) &&
        (!role || hero.roles.includes(role)),
    )
    .map((hero) => {
      const { picks, wins } = bracketStats(hero, bracket);
      return {
        hero,
        picks,
        winRate: winRate(wins, picks),
        // Each match has 10 picks, so shares sum to 1000%; scale to per-match
        pickRate: totalPicks ? (picks / totalPicks) * 1000 : null,
      };
    });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Stagger className="space-y-8">
        <StaggerItem>
          <PageHeader
            eyebrow="Hero meta · OpenDota"
            title="Heroes"
            description="Win and pick rates for every hero, by rank bracket"
          />
        </StaggerItem>
        <StaggerItem className="flex flex-wrap items-center gap-2">
          <ListSearch
            value={query}
            onChange={setQuery}
            placeholder="Search heroes"
            className="sm:w-56"
          />
          <ToggleGroup
            variant="outline"
            size="sm"
            value={attribute ? [attribute] : []}
            onValueChange={(value) => setAttribute(value[0] ?? null)}
            aria-label="Primary attribute"
          >
            {Object.entries(ATTRIBUTES).map(([key, label]) => (
              <ToggleGroupItem key={key} value={key} title={label}>
                {label.slice(0, 3)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select
            items={[
              { value: null, label: "Any role" },
              ...ROLES.map((r) => ({ value: r, label: r })),
            ]}
            value={role}
            onValueChange={setRole}
          >
            <SelectTrigger size="sm" aria-label="Role" className="rounded-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Any role</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            items={BRACKETS.map((b) => ({ value: b.value, label: b.label }))}
            value={bracket}
            onValueChange={(value) => value && setBracket(value)}
          >
            <SelectTrigger
              size="sm"
              aria-label="Rank bracket"
              className="rounded-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRACKETS.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ToggleGroup
            variant="outline"
            size="sm"
            className="ml-auto"
            value={[view]}
            onValueChange={(value) => {
              if (value[0] === "table" || value[0] === "grid")
                setView(value[0]);
            }}
            aria-label="Layout"
          >
            <ToggleGroupItem value="table" aria-label="Table">
              <IconList />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid">
              <IconLayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>
        </StaggerItem>
        <StaggerItem>
          <SectionHeading
            title={`${rows.length} heroes`}
            aside={
              <span className="text-xs text-muted-foreground tabular-nums">
                {BRACKETS.find((b) => b.value === bracket)?.label}
              </span>
            }
          />
        </StaggerItem>
      </Stagger>
      <div className="mt-6">
        {heroStats.isError ? (
          <QueryError message="Couldn't load heroes." queries={[heroStats]} />
        ) : heroStats.isLoading ? (
          <div className="h-96 rounded-sm hud-skeleton" />
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            No heroes match these filters.
          </p>
        ) : view === "table" ? (
          <HeroTable rows={rows} showBans={bracket === "pro"} />
        ) : (
          <HeroGrid rows={rows} />
        )}
      </div>
    </main>
  );
}
