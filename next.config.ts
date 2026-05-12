import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autoriser le dev depuis l'IP locale
  allowedDevOrigins: ["192.168.1.7"],

  // Ignorer les erreurs de TypeScript pendant le build (utile en dev)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Rewrites vers le backend Flask en dev
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/:path*",
            destination: "http://localhost:5328/api/:path*",
          },
        ]
      : [];
  },
};

export default nextConfig;
