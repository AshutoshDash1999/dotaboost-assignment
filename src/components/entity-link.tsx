import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Single source of truth for entity URLs, so every rendered ID can link out
export const routes = {
  player: (id: number | string) => `/players/${id}`,
  match: (id: number | string) => `/matches/${id}`,
  hero: (id: number | string) => `/heroes/${id}`,
  team: (id: number | string) => `/teams/${id}`,
  league: (id: number | string) => `/leagues/${id}`,
};

type EntityLinkProps = Omit<ComponentProps<typeof Link>, "href" | "id"> & {
  id: number | string;
};

const linkClass =
  "rounded-sm outline-none hover:text-gold focus-visible:ring-[3px] focus-visible:ring-ring/50";

function entityLink(href: (id: number | string) => string) {
  return function EntityLink({ id, className, ...props }: EntityLinkProps) {
    return (
      <Link href={href(id)} className={cn(linkClass, className)} {...props} />
    );
  };
}

export const PlayerLink = entityLink(routes.player);
export const MatchLink = entityLink(routes.match);
export const HeroLink = entityLink(routes.hero);
export const TeamLink = entityLink(routes.team);
export const LeagueLink = entityLink(routes.league);
