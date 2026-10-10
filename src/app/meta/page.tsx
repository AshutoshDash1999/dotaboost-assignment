import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ComboFinder } from "./_components/combo-finder";
import { RankDistribution } from "./_components/rank-distribution";
import { TeamScenarios } from "./_components/team-scenarios";

export const metadata: Metadata = {
  title: "Meta · Dota stats",
  description: "Rank distribution, team scenarios and a hero combo finder",
};

export default function MetaPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        eyebrow="Meta · OpenDota"
        title="Meta"
        description="How the player base is spread and what wins games"
      />
      <RankDistribution />
      <div className="grid gap-8 lg:grid-cols-2">
        <TeamScenarios />
        <ComboFinder />
      </div>
    </main>
  );
}
