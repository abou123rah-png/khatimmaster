import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // En production sur Vercel, les routes /api/* sont gérées
  // par la fonction Python api/index.py via vercel.json rewrites.
  // En dev local, on proxifie vers Flask sur le port 5328.
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:5328/api/:path*",
        },
      ];
    }
    // En production, Vercel gère les rewrites via vercel.json
    return [];
  },
};

export default nextConfig;
