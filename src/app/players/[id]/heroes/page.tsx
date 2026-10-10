import { PlayerHeroes } from "../_components/player-heroes";

export default async function PlayerHeroesPage({
  params,
}: PageProps<"/players/[id]/heroes">) {
  const { id } = await params;

  return <PlayerHeroes accountId={id} />;
}
