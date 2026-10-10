import { Button } from "@/components/ui/button";

type RetryableQuery = { isError: boolean; refetch: () => unknown };

// OpenDota answers 404 for entities it has never seen
export const isNotFound = (error: unknown) =>
  (error as { response?: { status?: number } } | null)?.response?.status ===
  404;

export function QueryError({
  message,
  queries,
}: {
  message: string;
  queries: RetryableQuery[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 hud-panel px-6 py-10 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button
        variant="outline"
        onClick={() => {
          for (const query of queries) if (query.isError) query.refetch();
        }}
      >
        Try again
      </Button>
    </div>
  );
}
