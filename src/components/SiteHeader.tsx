import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="Brandrisk – startsida">
      <Image className="brand-logo" src="/brandrisk-logo.png" alt="" width={38} height={38} priority />
      BRANDRISK
    </Link>
    <span className="authority-note">Myndighetsdata · uppdateras löpande</span>
  </header>;
}
