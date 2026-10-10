import type { Metadata } from "next";
import { HeroMeta } from "./_components/hero-meta";

export const metadata: Metadata = {
  title: "Heroes · Dota stats",
  description: "Dota 2 hero win and pick rates by rank bracket",
};

export default function HeroesPage() {
  return <HeroMeta />;
}
