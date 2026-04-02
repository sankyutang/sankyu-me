import type { CollectionConfig } from "payload";

export const Videos: CollectionConfig = {
  slug: "videos",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "platform", "status", "publishedAt", "updatedAt"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "platform",
      type: "select",
      required: true,
      defaultValue: "youtube",
      options: [
        { label: "YouTube", value: "youtube" },
        { label: "Bilibili", value: "bilibili" },
      ],
      index: true,
    },
    {
      name: "videoUrl",
      type: "text",
      required: true,
      admin: { description: "Full URL to the video page." },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
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
  ],
};
