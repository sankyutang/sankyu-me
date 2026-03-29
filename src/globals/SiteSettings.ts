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
