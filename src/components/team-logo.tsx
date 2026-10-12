import Image from "next/image";
import { cn } from "@/lib/utils";

// Mirrors the logo hosts in next.config.ts. OpenDota logo URLs occasionally
// point elsewhere, and next/image throws on unconfigured hosts, so those
// bypass the optimizer instead.
const OPTIMIZED_HOSTS = new Set([
  "cdn.steamusercontent.com",
  "steamusercontent-a.akamaihd.net",
  "steamcdn-a.akamaihd.net",
]);

function isOptimizable(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && OPTIMIZED_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

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
      unoptimized={!isOptimizable(url)}
    />
  );
}
