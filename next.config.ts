import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.aqstra.com",
      },
    ],
  },
};

export default nextConfig;
