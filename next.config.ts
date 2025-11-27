import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...các config khác của bạn
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
