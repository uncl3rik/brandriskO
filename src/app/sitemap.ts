import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/eldningsforbud", "/eldningsforbud/stockholm", "/brandrisknivaer", "/om"].map((path) => ({
    url: new URL(path, SITE_URL).href,
  }));
}
