import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true, // Enables gzip and Brotli compression for static assets
  // Ensure JS is minified (Next.js does this by default, but we can be explicit)
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Example: Split vendor code
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 240000,
      };
      // Ensure minification with TerserPlugin if not already present
      const TerserPlugin = require('terser-webpack-plugin');
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: true,
            mangle: true,
            output: { comments: false },
          },
          extractComments: false,
        })
      ];
    }
    return config;
  },
};

export default nextConfig;
