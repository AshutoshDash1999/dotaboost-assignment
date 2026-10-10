import { PlayerOverview } from "./_components/player-overview";

export default async function PlayerPage({
  params,
}: PageProps<"/players/[id]">) {
  const { id } = await params;

  return <PlayerOverview accountId={id} />;
}
