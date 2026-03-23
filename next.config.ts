import type { NextConfig } from "next";

const appOrigin = process.env.APP_ORIGIN ?? "https://beratung.genaumeinkurs.de";
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://api.elevenlabs.io wss://api.elevenlabs.io",
  "manifest-src 'self'",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Next.js accidentally inferring a parent workspace root when there are
    // other lockfiles on the machine (common on dev laptops).
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: appOrigin,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, HEAD, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
