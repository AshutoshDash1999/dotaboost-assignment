"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabsListVariants } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface TabNavItem {
  label: string;
  href: string;
}

// Route-backed tabs: each tab is its own URL, so only the open tab fetches data
export function TabNav({
  items,
  className,
}: {
  items: TabNavItem[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        tabsListVariants(),
        "h-9 max-w-full justify-start overflow-x-auto",
        className,
      )}
    >
      {items.map((item) => {
        // Hrefs may carry a query string (e.g. filters); match on the path only
        const active = pathname === item.href.split("?")[0];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-full items-center rounded-[2px] border border-transparent px-3 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:text-muted-foreground dark:hover:text-foreground",
              active &&
                "bg-card font-semibold text-gold shadow-[inset_0_-2px_0_var(--gold),0_4px_14px_-6px_var(--glow)] dark:text-gold",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
