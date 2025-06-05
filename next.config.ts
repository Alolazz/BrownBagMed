import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true, // Enables gzip and Brotli compression for static assets
  webpack: (config, { isServer }) => {
    // Example: Split vendor code
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 240000,
      };
    }
    return config;
  },
};

export default nextConfig;
