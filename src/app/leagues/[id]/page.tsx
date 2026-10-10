import { notFound } from "next/navigation";
import { LeagueDetails } from "./_components/league-details";

const isLeagueId = (id: string) => /^\d+$/.test(id);

export default async function LeaguePage({
  params,
}: PageProps<"/leagues/[id]">) {
  const { id } = await params;
  if (!isLeagueId(id)) notFound();

  return <LeagueDetails leagueId={id} />;
}
