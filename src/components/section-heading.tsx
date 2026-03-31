import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  className,
}: {
  title: string;
  description?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 space-y-2", className)}>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {description ? <p className="text-muted-foreground max-w-2xl text-sm md:text-base">{description}</p> : null}
    </div>
  );
}
