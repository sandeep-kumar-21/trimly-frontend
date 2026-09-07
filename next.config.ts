import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.31.23',
    'localhost:3000',
    '192.168.31.23:3000',
  ],
};

export default nextConfig;
