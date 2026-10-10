"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Sections are added here as their pages ship
const NAV_ITEMS = [
  {
    label: "Players",
    href: "/",
    match: (path: string) => path === "/" || path.startsWith("/players"),
  },
  {
    label: "Heroes",
    href: "/heroes",
    match: (path: string) => path.startsWith("/heroes"),
  },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-sm px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
              active && "text-gold hover:text-gold",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
