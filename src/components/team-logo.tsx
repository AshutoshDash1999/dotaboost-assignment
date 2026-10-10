import Image from "next/image";
import { cn } from "@/lib/utils";

export function TeamLogo({
  url,
  size = 24,
  className,
}: {
  url: string | null | undefined;
  size?: number;
  className?: string;
}) {
  const box = cn("shrink-0 rounded-[2px]", className);
  const style = { width: size, height: size };

  if (!url) {
    return (
      <div className={cn(box, "bg-muted ring-1 ring-frame")} style={style} />
    );
  }

  return (
    <Image
      src={url}
      alt=""
      width={size}
      height={size}
      className={cn(box, "object-contain")}
      style={style}
    />
  );
}
