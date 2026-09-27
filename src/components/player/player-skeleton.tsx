import { Card, CardContent, CardHeader } from "@/components/ui/card";

const STAT_KEYS = ["rank", "mmr", "winrate", "recent"];
const ROW_KEYS = ["row-0", "row-1", "row-2", "row-3", "row-4"];

export function PlayerSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 animate-pulse space-y-8 px-4 py-10 sm:px-6">
      <div className="h-4 w-36 rounded bg-muted" />
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="size-16 shrink-0 rounded-full bg-muted sm:size-24" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-1/3 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_KEYS.map((key) => (
          <Card key={key} size="sm">
            <CardContent className="space-y-2">
              <div className="h-3 w-1/2 rounded bg-muted" />
              <div className="h-6 w-2/3 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="h-80 rounded-xl bg-muted lg:col-span-2" />
        <div className="h-80 rounded-xl bg-muted" />
      </div>
      {["matches", "heroes"].map((section) => (
        <Card key={section}>
          <CardHeader>
            <div className="h-5 w-40 rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            {ROW_KEYS.map((key) => (
              <div key={key} className="h-7 rounded bg-muted" />
            ))}
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
