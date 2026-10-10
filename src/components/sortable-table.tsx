"use client";

import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { type ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  // Omit to make the column unsortable
  sortValue?: (row: T) => number | string;
  className?: string;
}

export function SortableTable<T>({
  rows,
  columns,
  rowKey,
  defaultSort,
  rowClassName,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  defaultSort: string;
  rowClassName?: (row: T) => string | undefined;
}) {
  const [sort, setSort] = useState({ key: defaultSort, desc: true });

  const column = columns.find((c) => c.key === sort.key);
  const sorted = column?.sortValue
    ? [...rows].sort((a, b) => {
        const av = column.sortValue?.(a) ?? 0;
        const bv = column.sortValue?.(b) ?? 0;
        const order = av < bv ? -1 : av > bv ? 1 : 0;
        return sort.desc ? -order : order;
      })
    : rows;

  return (
    <Table className="tabular-nums">
      <TableHeader className="text-[11px] tracking-wider uppercase">
        <TableRow className="border-frame hover:bg-transparent">
          {columns.map((c) => {
            const active = c.key === sort.key;
            return (
              <TableHead
                key={c.key}
                className={c.className}
                aria-sort={
                  active ? (sort.desc ? "descending" : "ascending") : undefined
                }
              >
                {c.sortValue ? (
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm uppercase outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      active && "text-gold",
                    )}
                    onClick={() =>
                      setSort({
                        key: c.key,
                        // First click sorts descending; clicking again flips it
                        desc: active ? !sort.desc : true,
                      })
                    }
                  >
                    {c.header}
                    {active &&
                      (sort.desc ? (
                        <IconArrowDown className="size-3" />
                      ) : (
                        <IconArrowUp className="size-3" />
                      ))}
                  </button>
                ) : (
                  c.header
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => (
          <TableRow key={rowKey(row)} className={rowClassName?.(row)}>
            {columns.map((c) => (
              <TableCell key={c.key} className={c.className}>
                {c.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
