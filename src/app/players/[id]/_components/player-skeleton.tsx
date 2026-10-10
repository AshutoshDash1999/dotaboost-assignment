import { Card, CardContent, CardHeader } from "@/components/ui/card";

const STAT_KEYS = ["rank", "mmr", "winrate", "recent"];
const ROW_KEYS = ["row-0", "row-1", "row-2", "row-3", "row-4"];

export function PlayerHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 hud-panel p-5 sm:gap-6 sm:p-8">
      <div className="size-16 shrink-0 rounded-sm hud-skeleton sm:size-24" />
      <div className="flex-1 space-y-2">
        <div className="h-7 w-1/3 rounded-sm hud-skeleton" />
        <div className="h-4 w-1/2 rounded-sm hud-skeleton" />
      </div>
    </div>
  );
}

export function PlayerOverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_KEYS.map((key) => (
          <Card key={key} size="sm">
            <CardContent className="space-y-2">
              <div className="h-3 w-1/2 rounded-sm hud-skeleton" />
              <div className="h-6 w-2/3 rounded-sm hud-skeleton" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="h-80 rounded-sm hud-skeleton lg:col-span-2" />
        <div className="h-80 rounded-sm hud-skeleton" />
      </div>
      {["matches", "heroes"].map((section) => (
        <Card key={section}>
          <CardHeader>
            <div className="h-5 w-40 rounded-sm hud-skeleton" />
          </CardHeader>
          <CardContent className="space-y-3">
            {ROW_KEYS.map((key) => (
              <div key={key} className="h-7 rounded-sm hud-skeleton" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
