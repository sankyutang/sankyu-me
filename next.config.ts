import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { redirects } from "./redirects";

const serverUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL != null
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

function parseRemotePattern(urlStr: string) {
  try {
    const u = new URL(urlStr);
    return {
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
    };
  } catch {
    return null;
  }
}

const imageHosts = [parseRemotePattern(serverUrl)].filter(Boolean) as {
  protocol: "http" | "https";
  hostname: string;
}[];

if (process.env.R2_PUBLIC_URL) {
  const r2 = parseRemotePattern(process.env.R2_PUBLIC_URL);
  if (r2) imageHosts.push(r2);
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: imageHosts,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
