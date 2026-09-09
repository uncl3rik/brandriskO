import Link from "next/link";
import { BRANDRISK_SOURCE } from "@/lib/seo";

export function SiteFooter() {
  return <footer className="site-footer">
    <span>Data från Myndigheten för civilt försvar. Byggt av KEZAB.</span>
    <div className="footer-links">
      <Link href="/om">Om tjänsten och datakällorna</Link>
      <a href={BRANDRISK_SOURCE}>Brandrisk Ute hos myndigheten</a>
    </div>
  </footer>;
}
