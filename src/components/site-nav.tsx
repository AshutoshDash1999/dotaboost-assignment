"use client";

import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Sections are added here as their pages ship
const NAV_ITEMS = [
  { label: "Players", href: "/", prefixes: ["/players"] },
  { label: "Matches", href: "/matches", prefixes: ["/matches"] },
  { label: "Live", href: "/live", prefixes: ["/live"] },
  { label: "Heroes", href: "/heroes", prefixes: ["/heroes"] },
  { label: "Teams", href: "/teams", prefixes: ["/teams"] },
  { label: "Leagues", href: "/leagues", prefixes: ["/leagues"] },
  { label: "Pros", href: "/pros", prefixes: ["/pros"] },
  { label: "Records", href: "/records", prefixes: ["/records"] },
  { label: "Meta", href: "/meta", prefixes: ["/meta"] },
];

const isActive = (pathname: string, item: (typeof NAV_ITEMS)[number]) =>
  pathname === item.href ||
  item.prefixes.some((prefix) => pathname.startsWith(prefix));

function NavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav aria-label="Main" className={className}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <NavLinks
        pathname={pathname}
        className="hidden items-center gap-0.5 lg:flex"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
            />
          }
        >
          <IconMenu2 />
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle className="hud-title">Dota Stats</SheetTitle>
          </SheetHeader>
          <NavLinks
            pathname={pathname}
            onNavigate={() => setOpen(false)}
            className="flex flex-col gap-1 px-4"
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
