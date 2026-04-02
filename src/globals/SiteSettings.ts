import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
    },
    {
      name: "siteUrl",
      type: "text",
      required: true,
      admin: { description: "Public site URL, e.g. https://sankyu.me" },
    },
    {
      name: "siteDescription",
      type: "textarea",
    },
    {
      name: "defaultSeoTitle",
      type: "text",
    },
    {
      name: "defaultSeoDescription",
      type: "textarea",
    },
    {
      name: "defaultOgImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "favicon",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "mainNav",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "footerNav",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        { name: "platform", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "newsletterTitle",
      type: "text",
    },
    {
      name: "newsletterDescription",
      type: "textarea",
    },
    {
      name: "newsletterUrl",
      type: "text",
      admin: { description: "Substack or other external subscribe URL." },
    },
    {
      name: "newsletterButtonLabel",
      type: "text",
      admin: { description: "CTA label on the newsletter block (e.g. Subscribe on Substack)." },
    },
    {
      name: "introHeadline",
      type: "text",
      admin: { description: "Homepage intro title; falls back to Hero title if empty." },
    },
    {
      name: "introBody",
      type: "textarea",
      admin: { description: "Homepage intro paragraph; falls back to Hero subtitle if empty." },
    },
    {
      name: "introAvatar",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Homepage brand mark (e.g. small logo ~34px) shown above the intro; not a large portrait.",
      },
    },
    {
      name: "introNameHighlight",
      type: "text",
      admin: {
        description:
          "Optional phrase in the headline to emphasize (e.g. your name). Must appear inside Intro headline text.",
      },
    },
    {
      name: "footerEmoji",
      type: "text",
      admin: { description: "Optional emoji shown on the minimal homepage footer (e.g. 👻)." },
    },
    {
      name: "newsletterSponsorLabel",
      type: "text",
      admin: { description: "Optional inline sponsor link label (e.g. GitHub Sponsors)." },
    },
    {
      name: "newsletterSponsorUrl",
      type: "text",
      admin: { description: "URL for the optional sponsor link next to newsletter copy." },
    },
    {
      name: "heroTitle",
      type: "text",
    },
    {
      name: "heroSubtitle",
      type: "textarea",
    },
    {
      name: "heroPrimaryCtaLabel",
      type: "text",
    },
    {
      name: "heroPrimaryCtaHref",
      type: "text",
    },
    {
      name: "heroSecondaryCtaLabel",
      type: "text",
    },
    {
      name: "heroSecondaryCtaHref",
      type: "text",
    },
  ],
};
