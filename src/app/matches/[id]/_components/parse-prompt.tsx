"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useParseJob, useRequestParse } from "@/lib/api/hooks";

// Graphs, builds and chat need the replay parsed by OpenDota first
export function ParsePrompt({ matchId }: { matchId: string }) {
  const queryClient = useQueryClient();
  const request = useRequestParse(matchId);
  const jobId = request.data?.job?.jobId;
  const job = useParseJob(jobId);
  const isDone = jobId !== undefined && job.data === null;

  // Reload the match once, so the parsed tabs pick up the new data
  useEffect(() => {
    if (isDone) {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.MATCHES, matchId] });
    }
  }, [isDone, matchId, queryClient]);

  const isWorking = request.isPending || job.isParsing;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
        <p className="max-w-md text-muted-foreground">
          {isWorking
            ? "Parsing the replay. This usually takes a minute or two."
            : "This match hasn't been parsed yet, so detailed data isn't available."}
        </p>
        {request.isError && (
          <p className="text-sm text-dire">
            Couldn't request a parse. The replay may have expired.
          </p>
        )}
        <Button
          variant="outline"
          disabled={isWorking}
          onClick={() => request.mutate()}
        >
          {isWorking && <IconLoader2 className="animate-spin" />}
          {isWorking ? "Parsing…" : "Request parse"}
        </Button>
      </CardContent>
    </Card>
  );
}
