import { PlayerActivity } from "../_components/player-activity";

export default async function PlayerActivityPage({
  params,
}: PageProps<"/players/[id]/activity">) {
  const { id } = await params;

  return <PlayerActivity accountId={id} />;
}
