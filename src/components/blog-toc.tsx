"use client";

import { useEffect, useState } from "react";

import { slugify } from "@/utilities/slugify";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

export function BlogTOC({ className }: { className?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const root = document.getElementById("article-body");
    if (!root) return;
    const nodes = root.querySelectorAll("h2, h3");
    const list: Heading[] = [];
    const used = new Set<string>();
    nodes.forEach((el, i) => {
      if (!(el instanceof HTMLElement)) return;
      const text = el.textContent?.trim() || "";
      let id = el.id;
      if (!id) {
        let base = slugify(text) || `section-${i}`;
        while (used.has(base)) {
          base = `${base}-${i}`;
        }
        id = base;
        used.add(id);
        el.id = id;
      } else {
        used.add(id);
      }
      list.push({
        id,
        text,
        level: el.tagName === "H2" ? 2 : 3,
      });
    });
    setHeadings(list);
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className={cn("text-sm", className)}>
      <p className="text-muted-foreground mb-3 font-medium">On this page</p>
      <ul className="space-y-2">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: h.level === 3 ? "0.75rem" : 0 }}
            className="text-muted-foreground"
          >
            <a href={`#${h.id}`} className="hover:text-foreground underline-offset-4 hover:underline">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
