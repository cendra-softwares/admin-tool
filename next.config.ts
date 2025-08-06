import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cxwsgjtxrudhxwdzillr.supabase.co",
      },
    ],
  },
};

export default nextConfig;
