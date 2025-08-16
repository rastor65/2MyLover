import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Solo si tu sitio queda bajo /REPO (Project Pages):
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true
};

export default nextConfig;
