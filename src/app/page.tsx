import { PageHeader } from "@/components/page-header";
import { PlayerSearch } from "@/components/player-search";
import { Stagger, StaggerItem } from "@/components/stagger";
import { HomeStrips } from "./_components/home-strips";
import { TopPlayers } from "./_components/top-players";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Stagger>
        <StaggerItem>
          <PageHeader
            eyebrow="Live rankings · OpenDota"
            title="Top Players"
            description="The highest-rated Dota 2 players by MMR"
          />
        </StaggerItem>
        <StaggerItem>
          <PlayerSearch />
        </StaggerItem>
      </Stagger>
      <TopPlayers />
      <HomeStrips />
    </main>
  );
}
