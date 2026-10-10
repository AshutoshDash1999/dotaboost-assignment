import { Button } from "@/components/ui/button";

export function ShowMoreButton({
  remaining,
  onClick,
}: {
  remaining: number;
  onClick: () => void;
}) {
  return (
    <div className="flex justify-center px-(--card-spacing) pt-4">
      <Button variant="outline" onClick={onClick}>
        Show more ({remaining.toLocaleString()} left)
      </Button>
    </div>
  );
}
