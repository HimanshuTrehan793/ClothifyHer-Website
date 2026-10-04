import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

const SITE_URL = process.env.SITE_URL || "https://clothifyher.in";

// Public, indexable static routes from src/App.tsx.
// Cart / Orders / Profile / Address / Payment are user-specific (excluded below).
const STATIC_ROUTES = ["/categories", "/privacy-policy"];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: SITE_URL,
      dynamicRoutes: STATIC_ROUTES,
      // Pages that should never appear in the sitemap.
      exclude: [
        "/cart",
        "/cart/*",
        "/orders",
        "/orders/*",
        "/profile",
        "/address",
        "/wishlist",
        "/payment-page",
        "/order-success",
        "/order-failure",
      ],
      changefreq: {
        "/": "daily",
        "/categories": "weekly",
        "/privacy-policy": "yearly",
      },
      priority: {
        "/": 1.0,
        "/categories": 0.8,
        "/privacy-policy": 0.3,
      },
      generateRobotsTxt: false, // we maintain our own robots.txt
      readable: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
