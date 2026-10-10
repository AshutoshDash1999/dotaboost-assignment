import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NotFoundPanel({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
      <title>{title}</title>
      <div className="flex w-full max-w-md flex-col items-center gap-3 hud-panel px-6 py-10 text-center">
        <h1 className="hud-title text-2xl">Lost in the fog</h1>
        <div className="my-1 hud-divider w-40" />
        <p className="text-muted-foreground">{message}</p>
        <Button
          variant="outline"
          className="mt-2"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Back to top players
        </Button>
      </div>
    </main>
  );
}
