import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://172.16.14.221:3000", "172.16.14.221", "192.168.241.72", "http://192.168.241.72:3000"],
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
