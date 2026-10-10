import Image from "next/image";
import type { HeroConstant } from "@/lib/api/types";
import { heroImageUrl } from "@/lib/dota";
import { cn } from "@/lib/utils";

// A team's heroes as a strip of small portraits; the losing side is dimmed
export function HeroLineup({
  heroIds,
  heroes,
  won,
}: {
  heroIds: number[];
  heroes: Record<string, HeroConstant>;
  won: boolean;
}) {
  return (
    <div className={cn("flex gap-0.5", !won && "opacity-60")}>
      {heroIds.map((heroId, index) => {
        const hero = heroes[heroId];
        return hero ? (
          <Image
            // biome-ignore lint/suspicious/noArrayIndexKey: lineup slots are fixed positions
            key={index}
            src={heroImageUrl(hero.img)}
            alt={hero.localized_name}
            title={hero.localized_name}
            width={36}
            height={20}
            className="h-5 w-9 rounded-[2px] object-cover ring-1 ring-frame"
          />
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: lineup slots are fixed positions
          <div key={index} className="h-5 w-9 rounded-[2px] bg-muted" />
        );
      })}
    </div>
  );
}
