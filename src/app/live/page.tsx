import type { Metadata } from "next";
import { LiveGames } from "./_components/live-games";

export const metadata: Metadata = {
  title: "Live · Dota stats",
  description: "Dota 2 games being played right now",
};

export default function LivePage() {
  return <LiveGames />;
}
