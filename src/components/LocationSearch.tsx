import { FormEvent, useState } from "react";
import { ArrowIcon, LocateIcon } from "@/components/Icons";

type Props = { busy: boolean; onLocate: () => void; onSearch: (query: string) => void };

export function LocationSearch({ busy, onLocate, onSearch }: Props) {
  const [query, setQuery] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (value) onSearch(value);
  }
  return <div className="location-actions">
    <button className="location-button" type="button" onClick={onLocate} disabled={busy}><LocateIcon />Använd min position</button>
    <div className="divider"><span>eller</span></div>
    <form className="search-form" role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor="place-search">Ange ort eller postnummer</label>
      <input id="place-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ange ort eller postnummer" autoComplete="postal-code" inputMode="search" />
      <button className="search-submit" type="submit" aria-label="Sök plats" disabled={busy || !query.trim()}><ArrowIcon /></button>
    </form>
    <p className="privacy-line"><span aria-hidden="true">●</span> Din exakta position sparas aldrig.</p>
  </div>;
}
