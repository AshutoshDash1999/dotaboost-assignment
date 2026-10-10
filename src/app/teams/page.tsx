import type { Metadata } from "next";
import { TeamList } from "./_components/team-list";

export const metadata: Metadata = {
  title: "Teams · Dota stats",
  description: "Professional Dota 2 teams ranked by rating",
};

export default function TeamsPage() {
  return <TeamList />;
}
