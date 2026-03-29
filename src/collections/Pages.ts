import type { CollectionConfig } from "payload";

import { slugify } from "@/utilities/slugify";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "pageType", "status", "updatedAt"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "pageType",
      type: "select",
      required: true,
      index: true,
      options: [
        { label: "About", value: "about" },
        { label: "Now", value: "now" },
        { label: "Uses", value: "uses" },
        { label: "Links", value: "links" },
        { label: "Custom", value: "custom" },
      ],
    },
    {
      name: "seoTitle",
      type: "text",
    },
    {
      name: "seoDescription",
      type: "textarea",
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return data;
        if ((operation === "create" || operation === "update") && data.title && !data.slug) {
          data.slug = slugify(String(data.title));
        }
        return data;
      },
    ],
  },
};
