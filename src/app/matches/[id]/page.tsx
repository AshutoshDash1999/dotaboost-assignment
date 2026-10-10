import { notFound } from "next/navigation";
import { MatchDetails } from "./_components/match-details";

const isMatchId = (id: string) => /^\d+$/.test(id);

export default async function MatchPage({
  params,
}: PageProps<"/matches/[id]">) {
  const { id } = await params;
  if (!isMatchId(id)) notFound();

  return <MatchDetails matchId={id} />;
}
