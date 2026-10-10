import { PlayerPeers } from "../_components/player-peers";

export default async function PlayerPeersPage({
  params,
}: PageProps<"/players/[id]/peers">) {
  const { id } = await params;

  return <PlayerPeers accountId={id} />;
}
