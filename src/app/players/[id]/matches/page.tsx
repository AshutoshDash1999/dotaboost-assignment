import { PlayerMatches } from "../_components/player-matches";

export default async function PlayerMatchesPage({
  params,
}: PageProps<"/players/[id]/matches">) {
  const { id } = await params;

  return <PlayerMatches accountId={id} />;
}
