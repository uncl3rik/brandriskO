import type { Metadata } from "next";

export const SITE_URL = "https://brandrisk.info";
export const BRANDRISK_SOURCE = "https://www.mcf.se/sv/om-oss/kommunikationskanaler/appar/brandrisk-ute/";
export const PROHIBITION_SOURCE = "https://www.mcf.se/sv/rad-till-privatpersoner/brandsakerhet/brandsakerhet-i-skog-mark-och-tradgard/eldningsforbud/";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, SITE_URL).href;
  const images = [{ url: `${SITE_URL}/og.png?v=3`, width: 1200, height: 630, alt: "Brandrisk idag" }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Brandrisk", locale: "sv_SE", type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
