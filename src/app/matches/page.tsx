import type { Metadata } from "next";
import { MatchFeeds } from "./_components/match-feeds";

export const metadata: Metadata = {
  title: "Matches · Dota stats",
  description: "The latest professional and public Dota 2 matches",
};

export default function MatchesPage() {
  return <MatchFeeds />;
}
