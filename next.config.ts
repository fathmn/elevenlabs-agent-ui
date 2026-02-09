import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Next.js accidentally inferring a parent workspace root when there are
    // other lockfiles on the machine (common on dev laptops).
    root: process.cwd(),
  },
};

export default nextConfig;
