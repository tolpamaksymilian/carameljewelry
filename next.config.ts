import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pełny eksport statyczny do folderu `out/` — bez SSR, API Routes i funkcji serverless.
  output: "export",
  // /kolekcje -> out/kolekcje.html (Netlify obsługuje „ładne” adresy bez rozszerzenia).
  trailingSlash: false,
  images: {
    // Optymalizacja obrazów next/image wymaga serwera — w eksporcie statycznym wyłączona.
    unoptimized: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
