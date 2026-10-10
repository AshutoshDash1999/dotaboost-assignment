import { NotFoundPanel } from "@/components/not-found-panel";

export function PlayerNotFound() {
  return (
    <NotFoundPanel
      title="Player not found"
      message="OpenDota has no data for this account."
    />
  );
}
