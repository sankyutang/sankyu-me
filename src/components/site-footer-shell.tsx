"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import type { NavItem } from "@/lib/nav";

export function SiteFooterShell({
  siteName,
  siteDescription,
  footerNav,
  socialLinks,
  footerEmoji,
}: {
  siteName: string;
  siteDescription?: string | null;
  footerNav: NavItem[];
  socialLinks: { platform: string; url: string }[];
  footerEmoji?: string | null;
}) {
  const pathname = usePathname();
  if (pathname === "/") {
    return (
      <SiteFooter
        variant="minimal"
        siteName={siteName}
        footerEmoji={footerEmoji}
      />
    );
  }
  return (
    <SiteFooter
      variant="full"
      siteName={siteName}
      siteDescription={siteDescription}
      footerNav={footerNav}
      socialLinks={socialLinks}
    />
  );
}
