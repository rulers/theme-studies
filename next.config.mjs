const nextConfig = {
  output: process.env.STATIC_EXPORT === "1" ? "export" : undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true,
};

export default nextConfig;
