import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/icons/social-icons";

export function HomeTopSocial({
  links,
  className,
}: {
  links: { platform: string; url: string }[];
  className?: string;
}) {
  const filtered = links.filter((l) => l.url?.trim());
  if (filtered.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center justify-start gap-3 py-4", className)}>
      {filtered.map((link) => {
        return (
          <a
            key={`${link.platform}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            title={link.platform}
            className="text-muted-foreground hover:text-foreground inline-flex transition-colors"
          >
            <SocialIcon platform={link.platform} className="size-[18px] shrink-0" />
            <span className="sr-only">{link.platform}</span>
          </a>
        );
      })}
    </div>
  );
}
