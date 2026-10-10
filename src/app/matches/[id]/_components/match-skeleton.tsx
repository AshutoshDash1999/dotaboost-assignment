import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ROW_KEYS = ["row-0", "row-1", "row-2", "row-3", "row-4"];

export function MatchSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6">
      <div className="h-8 w-24 rounded-sm hud-skeleton" />
      <div className="flex items-center justify-between gap-6 hud-panel p-5 sm:p-8">
        <div className="h-8 w-1/4 rounded-sm hud-skeleton" />
        <div className="h-12 w-32 rounded-sm hud-skeleton" />
        <div className="h-8 w-1/4 rounded-sm hud-skeleton" />
      </div>
      <div className="h-9 w-80 max-w-full rounded-sm hud-skeleton" />
      {["radiant", "dire"].map((side) => (
        <Card key={side}>
          <CardHeader>
            <div className="h-5 w-32 rounded-sm hud-skeleton" />
          </CardHeader>
          <CardContent className="space-y-3">
            {ROW_KEYS.map((key) => (
              <div key={key} className="h-9 rounded-sm hud-skeleton" />
            ))}
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
