"use client";

import { Tabs } from "@base-ui/react/tabs";
import Link from "next/link";
import type { ReactNode } from "react";

export const HOME_TAB_KEYS = ["blog", "products", "works", "podcasts", "videos"] as const;
export type HomeTabKey = (typeof HOME_TAB_KEYS)[number];

const TAB_META: { key: HomeTabKey; label: string }[] = [
  { key: "blog", label: "博客" },
  { key: "products", label: "产品" },
  { key: "works", label: "作品" },
  { key: "podcasts", label: "播客" },
  { key: "videos", label: "视频" },
];

export function HomeContentTabs({
  panels,
  moreHref,
  defaultTab = "blog",
}: {
  panels: Record<HomeTabKey, ReactNode>;
  moreHref: Record<HomeTabKey, string>;
  defaultTab?: HomeTabKey;
}) {
  return (
    <section className="pt-4">
      <Tabs.Root defaultValue={defaultTab}>
        <Tabs.List className="flex flex-wrap justify-start gap-x-5 gap-y-2" aria-label="内容分类">
          {TAB_META.map(({ key, label }) => (
            <Tabs.Tab
              key={key}
              value={key}
              className="text-muted-foreground data-[active]:text-foreground text-sm font-medium transition-colors data-[active]:font-semibold hover:text-foreground/80"
            >
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {HOME_TAB_KEYS.map((key) => (
          <Tabs.Panel key={key} value={key} className="mt-8 focus:outline-none">
            {panels[key]}
            <p className="mt-8 text-left">
              <Link
                href={moreHref[key]}
                className="text-muted-foreground hover:text-foreground text-sm font-medium underline-offset-4 hover:underline"
              >
                查看全部
              </Link>
            </p>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </section>
  );
}
