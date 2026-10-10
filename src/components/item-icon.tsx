import Image from "next/image";
import type { ItemConstant } from "@/lib/api/types";
import { itemImageUrl } from "@/lib/dota";
import { cn } from "@/lib/utils";

export function ItemIcon({
  item,
  className,
}: {
  item: ItemConstant | undefined;
  className?: string;
}) {
  const box = cn(
    "h-6 w-[33px] shrink-0 rounded-[2px] ring-1 ring-frame",
    className,
  );

  if (!item) return <div className={cn(box, "bg-muted/60")} />;

  return (
    <Image
      src={itemImageUrl(item.img)}
      alt={item.dname ?? ""}
      title={item.dname}
      width={33}
      height={24}
      className={cn(box, "object-cover")}
    />
  );
}
