"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Kontrollera plats" },
  { href: "/eldningsforbud", label: "Eldningsförbud" },
  { href: "/brandrisknivaer", label: "Brandrisknivåer" },
  { href: "/om", label: "Om tjänsten" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return <>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Brandrisk – startsida">
        <Image className="brand-logo" src="/brandrisk-logo.svg" alt="" width={342.23} height={54} unoptimized preload />
      </Link>
      <span className="authority-note">Myndighetsdata · uppdateras löpande</span>
    </header>
    <nav className="site-nav" aria-label="Huvudnavigation">
      <div className="site-nav-inner">
        {navigation.map(({ href, label }) => {
          const exact = pathname === href;
          const active = exact || (href === "/" ? pathname.startsWith("/plats/") : pathname.startsWith(`${href}/`));
          return <Link key={href} href={href} className={active ? "nav-active" : undefined} aria-current={exact ? "page" : active ? "location" : undefined}>{label}</Link>;
        })}
      </div>
    </nav>
  </>;
}
