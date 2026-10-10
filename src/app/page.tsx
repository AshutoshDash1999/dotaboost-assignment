import { PageHeader } from "@/components/page-header";
import { PlayerSearch } from "@/components/player-search";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem } from "@/components/stagger";
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
        <StaggerItem>
          <SectionHeading title="Leaderboard" className="mb-5" />
        </StaggerItem>
      </Stagger>
      <TopPlayers />
    </main>
  );
}
