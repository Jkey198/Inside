import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MVP is a static site: progress lives in localStorage, hosting is any static server.
  // cacheComponents stays off: it implies PPR, which Next refuses in export mode
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
