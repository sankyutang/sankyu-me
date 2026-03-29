import type { CollectionConfig } from "payload";

import { slugify } from "@/utilities/slugify";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt", "featured", "updatedAt"],
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
      name: "content",
      type: "richText",
      required: true,
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
      name: "publishedAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "updatedAtCustom",
      type: "date",
      admin: {
        description: "Optional override for “last updated” on the site.",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "readingTime",
      type: "number",
      admin: {
        description: "Minutes to read (optional; can be set manually).",
      },
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
      name: "canonicalUrl",
      type: "text",
    },
    {
      name: "newsletterCTAEnabled",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "relatedPosts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
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
