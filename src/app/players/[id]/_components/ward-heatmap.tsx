import Image from "next/image";
import type { WardCells } from "@/lib/api/types";

const MAP_IMAGE =
  "https://www.opendota.com/assets/images/dota2/map/detailed_740.webp";

// Ward cells span roughly 64–192 on both axes; y grows towards the top
const CELL_MIN = 64;
const CELL_RANGE = 128;

export function WardHeatmap({
  cells,
  color,
  label,
}: {
  cells: WardCells;
  color: string;
  label: string;
}) {
  const points = Object.entries(cells).flatMap(([x, column]) =>
    Object.entries(column).map(([y, count]) => ({
      x: ((Number(x) - CELL_MIN) / CELL_RANGE) * 100,
      y: (1 - (Number(y) - CELL_MIN) / CELL_RANGE) * 100,
      count,
    })),
  );
  const max = Math.max(1, ...points.map((point) => point.count));

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-sm ring-1 ring-frame">
      <Image
        src={MAP_IMAGE}
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        role="img"
        aria-label={`${label} placements: ${points.length} spots`}
      >
        {points.map((point) => (
          <circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r={0.8 + (point.count / max) * 1.6}
            fill={color}
            fillOpacity={0.35 + (point.count / max) * 0.6}
          />
        ))}
      </svg>
    </div>
  );
}
