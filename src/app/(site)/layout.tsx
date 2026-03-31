import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import { defaultMainNav } from "@/lib/nav";
import { getPayloadClient } from "@/lib/payload";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "sankyu.me",
    template: "%s · sankyu.me",
  },
  description: "Personal brand site — systems, AI workflows, indie building, and products.",
};

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient();
  let settings: {
    siteName?: string | null;
    mainNav?: { label: string; href: string }[] | null;
    footerNav?: { label: string; href: string }[] | null;
    socialLinks?: { platform: string; url: string }[] | null;
  } | null = null;

  try {
    settings = await payload.findGlobal({ slug: "site-settings" });
  } catch {
    settings = null;
  }

  const siteName = settings?.siteName || "sankyu.me";
  const mainNav =
    settings?.mainNav && settings.mainNav.length > 0 ? settings.mainNav : defaultMainNav;
  const footerNav =
    settings?.footerNav && settings.footerNav.length > 0 ? settings.footerNav : defaultMainNav;
  const socialLinks = settings?.socialLinks?.filter((s) => s.url) ?? [];

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <SiteHeader siteName={siteName} mainNav={mainNav} />
          <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
          <SiteFooter siteName={siteName} footerNav={footerNav} socialLinks={socialLinks} />
        </Providers>
      </body>
    </html>
  );
}
