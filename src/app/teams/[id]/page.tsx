import { notFound } from "next/navigation";
import { TeamDetails } from "./_components/team-details";

const isTeamId = (id: string) => /^\d+$/.test(id);

export default async function TeamPage({ params }: PageProps<"/teams/[id]">) {
  const { id } = await params;
  if (!isTeamId(id)) notFound();

  return <TeamDetails teamId={id} />;
}
