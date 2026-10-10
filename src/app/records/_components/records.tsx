"use client";

import { MatchLink } from "@/components/entity-link";
import { HeroCell } from "@/components/hero-cell";
import { PageHeader } from "@/components/page-header";
import { QueryError } from "@/components/query-error";
import { Stagger, StaggerItem } from "@/components/stagger";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHeroes, useRecords } from "@/lib/api/hooks";
import { dayjs } from "@/lib/dayjs";
import { formatDuration } from "@/lib/dota";

const SHOWN_RECORDS = 50;

const FIELDS = [
  { field: "kills", label: "Kills" },
  { field: "assists", label: "Assists" },
  { field: "deaths", label: "Deaths" },
  { field: "gold_per_min", label: "GPM" },
  { field: "xp_per_min", label: "XPM" },
  { field: "last_hits", label: "Last hits" },
  { field: "denies", label: "Denies" },
  { field: "hero_damage", label: "Hero damage" },
  { field: "tower_damage", label: "Tower damage" },
  { field: "hero_healing", label: "Healing" },
  { field: "duration", label: "Longest game" },
];

function RecordTable({ field }: { field: string }) {
  const records = useRecords(field);
  const heroes = useHeroes();
  // Duration is a match record, so it has no hero
  const isDuration = field === "duration";

  if (records.isError) {
    return <QueryError message="Couldn't load records." queries={[records]} />;
  }
  if (records.isLoading)
    return <div className="h-96 rounded-sm hud-skeleton" />;

  return (
    <Card>
      <CardContent className="px-0">
        <Table className="tabular-nums">
          <TableHeader className="text-[11px] tracking-wider uppercase">
            <TableRow className="border-frame hover:bg-transparent">
              <TableHead className="w-12 pl-(--card-spacing)">#</TableHead>
              <TableHead>Record</TableHead>
              {!isDuration && <TableHead>Hero</TableHead>}
              <TableHead className="hidden sm:table-cell">Match</TableHead>
              <TableHead className="pr-(--card-spacing)">Played</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.records.slice(0, SHOWN_RECORDS).map((record, index) => (
              <TableRow key={`${record.match_id}-${record.hero_id}`}>
                <TableCell className="pl-(--card-spacing) font-heading font-bold text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="font-semibold text-gold">
                  {isDuration
                    ? formatDuration(record.score)
                    : record.score.toLocaleString()}
                </TableCell>
                {!isDuration && (
                  <TableCell>
                    <HeroCell
                      hero={
                        record.hero_id
                          ? heroes.heroes[record.hero_id]
                          : undefined
                      }
                      linked
                    />
                  </TableCell>
                )}
                <TableCell className="hidden sm:table-cell">
                  <MatchLink
                    id={record.match_id}
                    className="text-muted-foreground"
                  >
                    {record.match_id}
                  </MatchLink>
                </TableCell>
                <TableCell className="pr-(--card-spacing) whitespace-nowrap text-muted-foreground">
                  {dayjs.unix(record.start_time).format("D MMM YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function Records() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Stagger className="space-y-8">
        <StaggerItem>
          <PageHeader
            eyebrow="Hall of fame · OpenDota"
            title="Records"
            description="The biggest single-match numbers OpenDota has seen"
          />
        </StaggerItem>
        <StaggerItem>
          <Tabs defaultValue="kills">
            <TabsList className="max-w-full justify-start overflow-x-auto">
              {FIELDS.map((f) => (
                <TabsTrigger key={f.field} value={f.field}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {FIELDS.map((f) => (
              <TabsContent key={f.field} value={f.field} className="mt-4">
                <RecordTable field={f.field} />
              </TabsContent>
            ))}
          </Tabs>
        </StaggerItem>
      </Stagger>
    </main>
  );
}
