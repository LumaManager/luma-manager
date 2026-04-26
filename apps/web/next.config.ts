import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@terapia/ui", "@terapia/contracts"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "lumamanager.com.br" }],
        destination: "https://www.lumamanager.com.br/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
