import { QueryError } from "@/components/query-error";

type TabQuery = {
  isError: boolean;
  isLoading: boolean;
  refetch: () => unknown;
};

// Loading and error states shared by the hero tabs; null once data is ready
export function tabPlaceholder(queries: TabQuery[], message: string) {
  if (queries.some((query) => query.isError)) {
    return <QueryError message={message} queries={queries} />;
  }
  if (queries.some((query) => query.isLoading)) {
    return <div className="h-96 rounded-sm hud-skeleton" />;
  }
  return null;
}
