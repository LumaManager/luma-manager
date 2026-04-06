import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@terapia/ui", "@terapia/contracts"]
};

export default nextConfig;
