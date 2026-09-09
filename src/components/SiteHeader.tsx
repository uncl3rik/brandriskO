import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return <>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Brandrisk – startsida">
        <Image className="brand-logo" src="/brandrisk-logo.png" alt="" width={38} height={38} preload />
        BRANDRISK
      </Link>
      <span className="authority-note">Myndighetsdata · uppdateras löpande</span>
    </header>
    <nav className="site-nav" aria-label="Huvudnavigation">
      <div className="site-nav-inner">
        <Link href="/">Kontrollera plats</Link>
        <Link href="/eldningsforbud">Eldningsförbud</Link>
        <Link href="/brandrisknivaer">Brandrisknivåer</Link>
        <Link href="/om">Om tjänsten</Link>
      </div>
    </nav>
  </>;
}
