import type { CollectionConfig } from "payload";

import { slugify } from "@/utilities/slugify";

export const Podcasts: CollectionConfig = {
  slug: "podcasts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt", "updatedAt"],
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
      name: "excerpt",
      type: "textarea",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "audioFile",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Upload audio file (optional if using external URL).",
      },
    },
    {
      name: "audioUrl",
      type: "text",
      admin: { description: "External MP3 or hosted audio URL." },
    },
    {
      name: "duration",
      type: "text",
      admin: { description: 'e.g. "42:15"' },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "showNotes",
      type: "richText",
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
      index: true,
    },
    {
      name: "externalLinks",
      type: "array",
      fields: [
        { name: "platform", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "relatedPosts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
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
