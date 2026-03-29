import type { CollectionConfig } from "payload";

import { slugify } from "@/utilities/slugify";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "status", "productType", "featured", "updatedAt"],
  },
  fields: [
    {
      name: "name",
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
      name: "summary",
      type: "textarea",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "gallery",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      options: [
        { label: "Active", value: "active" },
        { label: "Coming soon", value: "coming-soon" },
        { label: "Archived", value: "archived" },
      ],
      index: true,
    },
    {
      name: "productType",
      type: "select",
      required: true,
      defaultValue: "other",
      options: [
        { label: "Notion template", value: "notion-template" },
        { label: "Digital product", value: "digital-product" },
        { label: "Software", value: "software" },
        { label: "Service", value: "service" },
        { label: "Other", value: "other" },
      ],
      index: true,
    },
    {
      name: "priceText",
      type: "text",
      admin: { description: 'e.g. "$29" or "Free"' },
    },
    {
      name: "externalUrl",
      type: "text",
    },
    {
      name: "ctaText",
      type: "text",
      defaultValue: "Get it",
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "highlights",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
    },
    {
      name: "audience",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "faq",
      type: "array",
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
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
        if ((operation === "create" || operation === "update") && data.name && !data.slug) {
          data.slug = slugify(String(data.name));
        }
        return data;
      },
    ],
  },
};
