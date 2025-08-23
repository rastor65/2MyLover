// next.config.mjs
const isProd = process.env.NODE_ENV === 'production';
const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1] ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      // si usas dominio regional:
      // { protocol: "https", hostname: "*.storage.googleapis.com" },
    ],
  },
  images: { unoptimized: true },
  basePath: isProd && repo ? `/${repo}` : '',
  assetPrefix: isProd && repo ? `/${repo}/` : '',
  trailingSlash: true
};

export default nextConfig;
