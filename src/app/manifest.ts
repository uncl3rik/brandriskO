import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Brandrisk",
    short_name: "Brandrisk",
    description: "Se aktuell brandrisk och status för eldningsförbud på din plats i Sverige.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1e8",
    theme_color: "#09271d",
    icons: [
      { src: "/icon-192.png?v=3", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png?v=3", sizes: "512x512", type: "image/png" },
    ],
  };
}
