import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "puspa.sinus.ac.id",
        pathname: "/storage/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://puspa.sinus.ac.id/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
