import { PlayerSearch } from "@/components/player-search";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem } from "@/components/stagger";
import { TopPlayers } from "@/components/top-players";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Stagger>
        <StaggerItem>
          <header className="text-center">
            <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              Live rankings · OpenDota
            </p>
            <h1 className="mt-3 hud-title text-4xl sm:text-6xl">Top Players</h1>
            <p className="mt-3 text-muted-foreground">
              The highest-rated Dota 2 players by MMR
            </p>
            <div className="mx-auto mt-8 hud-divider max-w-md" />
          </header>
        </StaggerItem>
        <StaggerItem>
          <PlayerSearch />
        </StaggerItem>
        <StaggerItem>
          <SectionHeading title="Leaderboard" className="mb-5" />
        </StaggerItem>
      </Stagger>
      <TopPlayers />
    </main>
  );
}
