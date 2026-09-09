import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/eldningsforbud", "/brandrisknivaer", "/om"].map((path) => ({
    url: new URL(path, SITE_URL).href,
  }));
}
