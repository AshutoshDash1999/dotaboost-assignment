"use client";

import { IconLoader2, IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/use-debounce";
import { usePlayerLookup, useSearchPlayers } from "@/lib/api/hooks";
import { dayjs } from "@/lib/dayjs";
import { getRankLabel } from "@/lib/rank";
import { parsePlayerQuery } from "@/lib/steam";

const MAX_RESULTS = 20;
const SKELETON_KEYS = ["skeleton-0", "skeleton-1", "skeleton-2"];

interface PlayerOption {
  account_id: number;
  personaname: string | null;
  avatarfull: string | null;
  description: string;
}

export function PlayerSearch() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedInput = useDebounce(input);
  const query = parsePlayerQuery(debouncedInput);

  const nameQuery = query.kind === "name" ? query.q : null;
  const idQuery = query.kind === "id" ? query.accountId : null;

  const search = useSearchPlayers(nameQuery);
  const lookup = usePlayerLookup(idQuery);

  const active = nameQuery ? search : lookup;
  const isPending = input !== debouncedInput || active.isFetching;
  const profile = lookup.player?.profile;

  const options: PlayerOption[] = nameQuery
    ? search.searchResults.slice(0, MAX_RESULTS).map((player) => ({
        account_id: player.account_id,
        personaname: player.personaname,
        avatarfull: player.avatarfull,
        description: `Last match ${
          player.last_match_time
            ? dayjs.utc(player.last_match_time).local().fromNow()
            : "—"
        }`,
      }))
    : idQuery && profile
      ? [
          {
            account_id: profile.account_id,
            personaname: profile.personaname,
            avatarfull: profile.avatarfull,
            description: `${getRankLabel(lookup.player?.rank_tier ?? null)} · ID ${profile.account_id}`,
          },
        ]
      : [];

  return (
    <section className="mb-10">
      <Combobox<PlayerOption>
        items={options}
        // Results are already filtered server-side by OpenDota
        filter={null}
        value={null}
        inputValue={input}
        onInputValueChange={setInput}
        open={open && query.kind !== "empty"}
        onOpenChange={setOpen}
        itemToStringLabel={(player) => player.personaname ?? ""}
        // An ID resolves to exactly one player, so Enter can open it directly;
        // names aren't unique, so the user must pick one explicitly
        autoHighlight={query.kind === "id"}
      >
        <div ref={anchorRef}>
          <ComboboxInput
            className="h-11 w-full"
            placeholder="Search by name, Dota ID or Steam ID"
            aria-label="Search players"
            showTrigger={false}
            showClear={!!input && !isPending}
          >
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            {isPending && (
              <InputGroupAddon align="inline-end">
                <IconLoader2 className="animate-spin" aria-label="Searching" />
              </InputGroupAddon>
            )}
          </ComboboxInput>
        </div>

        <ComboboxContent anchor={anchorRef} className="min-w-(--anchor-width)">
          {active.isLoading ? (
            <ResultsSkeleton count={idQuery ? 1 : SKELETON_KEYS.length} />
          ) : nameQuery && search.isError ? (
            <div className="flex flex-col items-center gap-3 p-4 text-center text-sm">
              <p className="text-muted-foreground">Couldn't search players.</p>
              <Button variant="outline" onClick={() => search.refetch()}>
                Try again
              </Button>
            </div>
          ) : options.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              {idQuery
                ? `No player with ID ${idQuery}.`
                : `No players found for “${nameQuery}”.`}
            </p>
          ) : (
            <ComboboxList>
              {options.map((player) => (
                <ComboboxItem
                  key={player.account_id}
                  value={player}
                  className="cursor-pointer pr-3"
                  render={<Link href={`/players/${player.account_id}`} />}
                >
                  <PlayerOptionRow player={player} />
                </ComboboxItem>
              ))}
            </ComboboxList>
          )}
        </ComboboxContent>
      </Combobox>
    </section>
  );
}

function PlayerOptionRow({ player }: { player: PlayerOption }) {
  return (
    <>
      {player.avatarfull ? (
        <Image
          src={player.avatarfull}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full"
        />
      ) : (
        <div className="size-9 shrink-0 rounded-full bg-muted" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {player.personaname || "Anonymous"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {player.description}
        </p>
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        #{player.account_id}
      </span>
    </>
  );
}

function ResultsSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-1 p-1">
      {SKELETON_KEYS.slice(0, count).map((key) => (
        <div
          key={key}
          className="flex animate-pulse items-center gap-2.5 px-3 py-2"
        >
          <div className="size-9 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 rounded bg-muted" />
            <div className="h-3 w-1/4 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
