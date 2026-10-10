export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="text-center">
      <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 hud-title text-4xl sm:text-6xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{description}</p>
      <div className="mx-auto mt-8 hud-divider max-w-md" />
    </header>
  );
}
