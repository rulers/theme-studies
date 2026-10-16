import type { NextConfig } from "next";

// This edition is a standalone app nested inside the JavaScript repository.
const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
};

export default nextConfig;
