import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path, { posix } from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Podcasts } from "./collections/Podcasts";
import { Posts } from "./collections/Posts";
import { Products } from "./collections/Products";
import { Videos } from "./collections/Videos";
import { Works } from "./collections/Works";
import { Tags } from "./collections/Tags";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const r2Ready =
  Boolean(process.env.R2_BUCKET) &&
  Boolean(process.env.R2_ACCESS_KEY_ID) &&
  Boolean(process.env.R2_SECRET_ACCESS_KEY) &&
  Boolean(process.env.R2_ENDPOINT);

const storagePlugins = r2Ready
  ? [
      s3Storage({
        bucket: process.env.R2_BUCKET as string,
        collections: {
          media: {
            generateFileURL: ({ filename, prefix = "" }) => {
              const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
              const key = posix.join(prefix, filename).replace(/^\//, "");
              if (!publicBase) {
                const ep = process.env.R2_ENDPOINT?.replace(/\/$/, "") || "";
                const bucket = process.env.R2_BUCKET || "";
                return `${ep}/${bucket}/${key}`;
              }
              return `${publicBase}/${key.split("/").map(encodeURIComponent).join("/")}`;
            },
          },
        },
        config: {
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
          },
          region: process.env.R2_REGION || "auto",
          endpoint: process.env.R2_ENDPOINT as string,
          forcePathStyle: true,
        },
      }),
    ]
  : [];

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Tags, Posts, Products, Podcasts, Works, Videos, Pages],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [...storagePlugins],
});
