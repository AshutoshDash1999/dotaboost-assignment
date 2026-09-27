import { PlayerSearch } from "@/components/player-search";
import { Stagger, StaggerItem } from "@/components/stagger";
import { TopPlayers } from "@/components/top-players";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Stagger>
        <StaggerItem>
          <PlayerSearch />
        </StaggerItem>
        <StaggerItem>
          <header className="mb-8">
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Top Players
            </h1>
            <p className="mt-1 text-muted-foreground">
              Highest-rated Dota 2 players by MMR
            </p>
          </header>
        </StaggerItem>
      </Stagger>
      <TopPlayers />
    </main>
  );
}
