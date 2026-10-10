"use client";

import { IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { MatchLink } from "@/components/entity-link";
import { HeroLineup } from "@/components/hero-lineup";
import { QueryError } from "@/components/query-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFindMatches, useHeroes } from "@/lib/api/hooks";
import type { HeroConstant } from "@/lib/api/types";
import { dayjs } from "@/lib/dayjs";
import { heroImageUrl } from "@/lib/dota";

const TEAM_SIZE = 5;

function TeamPicker({
  label,
  picked,
  onChange,
  heroes,
  taken,
}: {
  label: string;
  picked: number[];
  onChange: (picked: number[]) => void;
  heroes: HeroConstant[];
  // Heroes already on either team can't be picked again
  taken: Set<number>;
}) {
  const options = heroes.filter((hero) => !taken.has(hero.id));
  const items = [
    { value: null, label: "Add a hero" },
    ...options.map((hero) => ({
      value: String(hero.id),
      label: hero.localized_name,
    })),
  ];
  const byId = new Map(heroes.map((hero) => [hero.id, hero]));

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        {picked.map((id) => {
          const hero = byId.get(id);
          return (
            <span
              key={id}
              className="flex items-center gap-1.5 rounded-sm border border-frame bg-muted/40 py-0.5 pr-0.5 pl-1"
            >
              {hero && (
                <Image
                  src={heroImageUrl(hero.img)}
                  alt=""
                  width={28}
                  height={16}
                  className="h-4 w-7 rounded-[2px] object-cover"
                />
              )}
              <span className="text-xs">{hero?.localized_name}</span>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${hero?.localized_name}`}
                onClick={() => onChange(picked.filter((p) => p !== id))}
              >
                <IconX />
              </Button>
            </span>
          );
        })}
        {picked.length < TEAM_SIZE && (
          <Select
            items={items}
            // Always reset to the placeholder after a pick
            value={null}
            onValueChange={(value) =>
              value && onChange([...picked, Number(value)])
            }
          >
            <SelectTrigger
              size="sm"
              aria-label={`Add a hero to ${label}`}
              className="rounded-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {options.map((hero) => (
                <SelectItem key={hero.id} value={String(hero.id)}>
                  {hero.localized_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

export function ComboFinder() {
  const heroes = useHeroes();
  const [teamA, setTeamA] = useState<number[]>([]);
  const [teamB, setTeamB] = useState<number[]>([]);
  const found = useFindMatches(teamA, teamB);

  const heroList = Object.values(heroes.heroes).sort((a, b) =>
    a.localized_name.localeCompare(b.localized_name),
  );
  const taken = new Set([...teamA, ...teamB]);
  const hasPicks = taken.size > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero combo finder</CardTitle>
        <CardDescription>
          Recent matches where these heroes played together or against each
          other
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TeamPicker
          label="Team A"
          picked={teamA}
          onChange={setTeamA}
          heroes={heroList}
          taken={taken}
        />
        <TeamPicker
          label="Team B"
          picked={teamB}
          onChange={setTeamB}
          heroes={heroList}
          taken={taken}
        />
        {!hasPicks ? (
          <p className="py-4 text-center text-muted-foreground">
            Pick at least one hero to search.
          </p>
        ) : found.isError ? (
          <QueryError message="Couldn't search matches." queries={[found]} />
        ) : found.isLoading ? (
          <div className="h-40 rounded-sm hud-skeleton" />
        ) : found.matches.length === 0 ? (
          <p className="py-4 text-center text-muted-foreground">
            No recent matches with this combination.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {found.matches.map((match) => (
              <li
                key={match.match_id}
                className="relative flex flex-wrap items-center gap-x-3 gap-y-1 py-2"
              >
                {/* Stretched link: the whole row opens the match */}
                <MatchLink
                  id={match.match_id}
                  aria-label={`Match ${match.match_id}`}
                  className="after:absolute after:inset-0"
                >
                  <HeroLineup
                    heroIds={match.teama}
                    heroes={heroes.heroes}
                    won={match.teamawin}
                  />
                </MatchLink>
                <span className="text-xs text-muted-foreground">vs</span>
                <HeroLineup
                  heroIds={match.teamb}
                  heroes={heroes.heroes}
                  won={!match.teamawin}
                />
                <span className="ml-auto text-xs text-muted-foreground">
                  {dayjs.unix(match.start_time).fromNow()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
