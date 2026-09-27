import { notFound } from "next/navigation";
import { PlayerDetails } from "@/components/player/player-details";

const isAccountId = (id: string) => /^\d+$/.test(id);

export default async function PlayerPage({
  params,
}: PageProps<"/players/[id]">) {
  const { id } = await params;
  if (!isAccountId(id)) notFound();

  return <PlayerDetails accountId={id} />;
}
