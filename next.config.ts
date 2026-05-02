import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // En production sur Vercel, les routes /api/* sont gérées
  // par la fonction Python api/index.py via vercel.json rewrites.
  // En dev local, on proxifie vers Flask sur le port 5328.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
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
