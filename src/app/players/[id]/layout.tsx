import { notFound } from "next/navigation";
import { PlayerShell } from "./_components/player-shell";

const isAccountId = (id: string) => /^\d+$/.test(id);

export default async function PlayerLayout({
  children,
  params,
}: LayoutProps<"/players/[id]">) {
  const { id } = await params;
  if (!isAccountId(id)) notFound();

  return <PlayerShell accountId={id}>{children}</PlayerShell>;
}
