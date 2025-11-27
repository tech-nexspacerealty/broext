import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
      bodySizeLimit: "50mb"
    }
  }
};

export default nextConfig;
