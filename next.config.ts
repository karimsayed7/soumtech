// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mudztaggnrtemluffgii.supabase.co",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;