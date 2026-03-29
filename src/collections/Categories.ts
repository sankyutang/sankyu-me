import type { CollectionConfig } from "payload";

import { slugify } from "@/utilities/slugify";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
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
      name: "description",
      type: "textarea",
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
