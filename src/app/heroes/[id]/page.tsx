import { notFound } from "next/navigation";
import { HeroDetails } from "./_components/hero-details";

const isHeroId = (id: string) => /^\d+$/.test(id);

export default async function HeroPage({ params }: PageProps<"/heroes/[id]">) {
  const { id } = await params;
  if (!isHeroId(id)) notFound();

  return <HeroDetails heroId={id} />;
}
