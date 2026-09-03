import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="Brandrisk – startsida"><span className="brand-mark" aria-hidden="true">B</span>BRANDRISK</Link>
    <span className="authority-note">Myndighetsdata · uppdateras löpande</span>
  </header>;
}
