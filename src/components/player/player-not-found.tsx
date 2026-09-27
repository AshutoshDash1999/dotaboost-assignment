import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PlayerNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <title>Player not found</title>
      <h1 className="font-heading text-2xl font-semibold">Player not found</h1>
      <p className="text-muted-foreground">
        OpenDota has no data for this account.
      </p>
      <Button variant="outline" render={<Link href="/" />}>
        Back to top players
      </Button>
    </main>
  );
}
