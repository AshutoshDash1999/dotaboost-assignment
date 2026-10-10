import type { Metadata } from "next";
import { LeagueList } from "./_components/league-list";

export const metadata: Metadata = {
  title: "Leagues · Dota stats",
  description: "Dota 2 tournaments and leagues tracked by OpenDota",
};

export default function LeaguesPage() {
  return <LeagueList />;
}
