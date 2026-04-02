import "./polyfill-web-globals";
import "dotenv/config";
import { defaultRichTextValue } from "@payloadcms/richtext-lexical";
import { getPayload } from "payload";
import type { SerializedEditorState } from "lexical";

import config from "../src/payload.config";

/** Lexical requires each paragraph to contain a text node; empty `children: []` fails validation. */
const emptyLexical = structuredClone(defaultRichTextValue) as SerializedEditorState;

function welcomePostContent(): SerializedEditorState {
  const state = structuredClone(defaultRichTextValue) as SerializedEditorState;
  const paragraph = state.root.children[0] as {
    type: string;
    children?: Array<{ type: string; text?: string }>;
  };
  if (paragraph?.type === "paragraph" && paragraph.children?.[0]?.type === "text") {
    paragraph.children[0].text = "Your Payload + Next.js stack is ready.";
  }
  return state;
}

async function seed() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      siteName: "sankyu.me",
      siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
      siteDescription: "Systems, AI workflows, indie building, and products.",
      heroTitle: "Build a one-person company with systems, AI, and leverage.",
      heroSubtitle:
        "I write about Notion systems, AI workflows, indie building, and creator business.",
      heroPrimaryCtaLabel: "Explore Products",
      heroPrimaryCtaHref: "/products",
      heroSecondaryCtaLabel: "Join Newsletter",
      heroSecondaryCtaHref: "/newsletter",
      newsletterTitle: "Newsletter",
      newsletterDescription: "Deep dives on systems and indie building.",
      mainNav: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Products", href: "/products" },
        { label: "Works", href: "/works" },
        { label: "Videos", href: "/videos" },
        { label: "Podcast", href: "/podcast" },
        { label: "About", href: "/about" },
        { label: "Now", href: "/now" },
        { label: "Uses", href: "/uses" },
        { label: "Links", href: "/links" },
        { label: "Search", href: "/search" },
      ],
      footerNav: [
        { label: "Blog", href: "/blog" },
        { label: "Products", href: "/products" },
        { label: "Newsletter", href: "/newsletter" },
      ],
    },
  });

  const existingCats = await payload.find({ collection: "categories", limit: 1 });
  let categoryId: string | number | undefined;
  if (existingCats.docs.length === 0) {
    const c = await payload.create({
      collection: "categories",
      data: { name: "Essays", slug: "essays", description: "Long-form notes" },
    });
    categoryId = c.id;
  } else {
    categoryId = existingCats.docs[0].id;
  }

  const existingTags = await payload.find({ collection: "tags", limit: 1 });
  let tagId: string | number | undefined;
  if (existingTags.docs.length === 0) {
    const t = await payload.create({
      collection: "tags",
      data: { name: "Indie", slug: "indie" },
    });
    tagId = t.id;
  } else {
    tagId = existingTags.docs[0].id;
  }

  const existingPosts = await payload.find({ collection: "posts", limit: 1 });
  if (existingPosts.docs.length === 0 && categoryId != null && tagId != null) {
    await payload.create({
      collection: "posts",
      data: {
        title: "Hello from sankyu.me",
        slug: "hello-from-sankyume",
        excerpt: "Your Payload + Next.js stack is ready.",
        status: "published",
        publishedAt: new Date().toISOString(),
        featured: true,
        readingTime: 2,
        category: categoryId,
        tags: [tagId],
        content: welcomePostContent(),
      },
    });
  }

  const pageTypes = [
    { pageType: "about" as const, title: "About", slug: "about" },
    { pageType: "now" as const, title: "Now", slug: "now" },
    { pageType: "uses" as const, title: "Uses", slug: "uses" },
    { pageType: "links" as const, title: "Links", slug: "links" },
  ];

  for (const p of pageTypes) {
    const found = await payload.find({
      collection: "pages",
      where: { pageType: { equals: p.pageType } },
      limit: 1,
    });
    if (found.docs.length === 0) {
      await payload.create({
        collection: "pages",
        data: {
          title: p.title,
          slug: p.slug,
          pageType: p.pageType,
          status: "published",
          content: emptyLexical,
        },
      });
    }
  }

  const existingWorks = await payload.find({ collection: "works", limit: 1 });
  if (existingWorks.docs.length === 0) {
    await payload.create({
      collection: "works",
      data: {
        title: "示例作品",
        slug: "sample-work",
        summary: "在后台添加更多作品条目。",
        status: "published",
        publishedAt: new Date().toISOString(),
        featured: true,
        content: emptyLexical,
      },
    });
  }

  const existingVideos = await payload.find({ collection: "videos", limit: 1 });
  if (existingVideos.docs.length === 0) {
    await payload.create({
      collection: "videos",
      data: {
        title: "示例视频",
        platform: "youtube",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description: "替换为你在 YouTube 或 Bilibili 的真实链接。",
        status: "published",
        publishedAt: new Date().toISOString(),
      },
    });
  }

  console.log("Seed completed.");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
