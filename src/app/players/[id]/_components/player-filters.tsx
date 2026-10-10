"use client";

import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConstant, useHeroes } from "@/lib/api/hooks";
import type { NamedConstant, PatchConstant } from "@/lib/api/types";
import { formatConstantName, LANE_ROLES } from "@/lib/dota";
import { type FilterKey, usePlayerFilters } from "../_hooks/use-player-filters";

type Option = { value: string; label: string };

const RECENT_PATCHES = 12;

const PERIODS: Option[] = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last year" },
];

// The game modes people actually filter by; the full list is mostly legacy
const GAME_MODE_IDS = [1, 2, 3, 4, 16, 18, 22, 23];

// lobby_type IDs from dotaconstants
const LOBBIES: Option[] = [
  { value: "0", label: "Normal" },
  { value: "7", label: "Ranked" },
  { value: "2", label: "Tournament" },
  { value: "9", label: "Battle Cup" },
];

const SIDES: Option[] = [
  { value: "1", label: "Radiant" },
  { value: "0", label: "Dire" },
];

const RESULTS: Option[] = [
  { value: "1", label: "Won" },
  { value: "0", label: "Lost" },
];

function FilterSelect({
  filterKey,
  anyLabel,
  options,
  value,
  onChange,
}: {
  filterKey: FilterKey;
  anyLabel: string;
  options: Option[];
  value: string | undefined;
  onChange: (key: FilterKey, value: string | null) => void;
}) {
  const items = [{ value: null, label: anyLabel }, ...options];

  return (
    <Select
      items={items}
      value={value ?? null}
      onValueChange={(next) => onChange(filterKey, next)}
    >
      <SelectTrigger
        size="sm"
        aria-label={anyLabel}
        className="rounded-sm data-[active=true]:border-gold/60 data-[active=true]:text-gold"
        data-active={value !== undefined}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {items.map((item) => (
          <SelectItem key={item.value ?? "any"} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PlayerFilters() {
  const { filters, hasFilters, setFilter, clearFilters } = usePlayerFilters();
  const heroes = useHeroes();
  const patches = useConstant<PatchConstant[]>("patch");
  const gameModes = useConstant<Record<string, NamedConstant>>("game_mode");

  const heroOptions = Object.values(heroes.heroes)
    .map((hero) => ({ value: String(hero.id), label: hero.localized_name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const patchOptions = [...(patches.constant ?? [])]
    .reverse()
    .slice(0, RECENT_PATCHES)
    .map((patch) => ({
      value: String(patch.id),
      label: `Patch ${patch.name}`,
    }));

  const gameModeOptions = GAME_MODE_IDS.map((id) => ({
    value: String(id),
    label: formatConstantName(gameModes.constant?.[id]?.name, "game_mode_"),
  }));

  const laneOptions = Object.entries(LANE_ROLES).map(([value, label]) => ({
    value,
    label,
  }));

  const selects: [FilterKey, string, Option[]][] = [
    ["date", "All time", PERIODS],
    ["patch", "Any patch", patchOptions],
    ["hero_id", "Any hero", heroOptions],
    ["game_mode", "Any mode", gameModeOptions],
    ["lobby_type", "Any lobby", LOBBIES],
    ["lane_role", "Any lane", laneOptions],
    ["is_radiant", "Any side", SIDES],
    ["win", "Any result", RESULTS],
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selects.map(([key, anyLabel, options]) => (
        <FilterSelect
          key={key}
          filterKey={key}
          anyLabel={anyLabel}
          options={options}
          value={filters[key]}
          onChange={setFilter}
        />
      ))}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <IconX />
          Clear
        </Button>
      )}
    </div>
  );
}
