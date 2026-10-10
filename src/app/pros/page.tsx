import type { Metadata } from "next";
import { ProPlayers } from "./_components/pro-players";

export const metadata: Metadata = {
  title: "Pro players · Dota stats",
  description: "Directory of professional Dota 2 players and their teams",
};

export default function ProsPage() {
  return <ProPlayers />;
}
