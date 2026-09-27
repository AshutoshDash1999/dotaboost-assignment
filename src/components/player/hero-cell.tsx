import Image from "next/image";
import type { HeroConstant } from "@/lib/api/types";
import { heroImageUrl } from "@/lib/dota";

export function HeroCell({ hero }: { hero: HeroConstant | undefined }) {
  return (
    <div className="flex items-center gap-2.5">
      {hero ? (
        <Image
          src={heroImageUrl(hero.img)}
          alt=""
          width={48}
          height={27}
          className="h-[27px] w-12 shrink-0 rounded-[2px] object-cover shadow-sm ring-1 ring-frame"
        />
      ) : (
        <div className="h-[27px] w-12 shrink-0 rounded-[2px] bg-muted ring-1 ring-frame" />
      )}
      <span className="truncate font-medium">
        {hero?.localized_name ?? "Unknown hero"}
      </span>
    </div>
  );
}
