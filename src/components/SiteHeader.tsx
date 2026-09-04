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
    <div className="affiliation-bar">
      <div className="affiliation-inner">
        <a className="affiliation-link" href="https://brandrisk.work" target="_blank" rel="noopener noreferrer">
          <span>en del av</span>
          <Image className="affiliation-logo" src="/taby-eldstader-logo.png" alt="Täby Eldstäder" width={2172} height={724} />
        </a>
      </div>
    </div>
  </>;
}
