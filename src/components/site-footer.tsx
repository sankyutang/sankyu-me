import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import type { NavItem } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { SocialIcon } from "@/components/icons/social-icons";

export function SiteFooter(
  props:
    | {
        variant: "minimal";
        siteName: string;
        footerEmoji?: string | null;
      }
    | {
        variant: "full";
        siteName: string;
        siteDescription?: string | null;
        footerNav: NavItem[];
        socialLinks: { platform: string; url: string }[];
      },
) {
  if (props.variant === "minimal") {
    const emoji = props.footerEmoji?.trim();
    return (
      <footer className="border-border mt-24 border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-10 md:px-[60px]">
          <p className="text-muted-foreground text-xs">
            {props.siteName} © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-2">
            {emoji ? (
              <span className="text-muted-foreground text-xs" aria-hidden>
                {emoji}
              </span>
            ) : null}
            <ThemeToggle />
          </div>
        </div>
      </footer>
    );
  }

  const { siteName, siteDescription, footerNav, socialLinks } = props;

  return (
    <footer className="border-border mt-24 border-t">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="font-semibold">{siteName}</p>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
              {siteDescription?.trim() ||
                "One-person company, systems, and leverage — built in public."}
            </p>
          </div>
          {socialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-4 text-sm">
              {socialLinks.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
                >
                  <SocialIcon platform={s.platform} className="size-[18px] shrink-0" />
                  <span className="sr-only">{s.platform}</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {siteName}
          </p>
        </div>
      </div>
    </footer>
  );
}
