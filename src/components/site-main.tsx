"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <div className={isHome ? "min-h-screen" : "min-h-[calc(100vh-3.5rem)]"}>{children}</div>
  );
}
