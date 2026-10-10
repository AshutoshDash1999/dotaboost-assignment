import { PlayerRankings } from "../_components/player-rankings";

export default async function PlayerRankingsPage({
  params,
}: PageProps<"/players/[id]/rankings">) {
  const { id } = await params;

  return <PlayerRankings accountId={id} />;
}
