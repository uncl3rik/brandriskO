import { FormEvent } from "react";
import { ArrowIcon, LocateIcon } from "@/components/Icons";

type Props = { busy: boolean; query: string; onQueryChange: (query: string) => void; onLocate: () => void; onSearch: (query: string) => void };

export function LocationSearch({ busy, query, onQueryChange, onLocate, onSearch }: Props) {
  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (value.length >= 2 && value.length <= 100) onSearch(value);
  }
  return <div className="location-actions">
    <button className="location-button" type="button" onClick={onLocate} disabled={busy}><LocateIcon />Kolla min plats</button>
    <div className="divider"><span>eller</span></div>
    <form className="search-form" role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor="place-search">Ange ort eller postnummer</label>
      <input id="place-search" type="search" name="place" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Ort eller postnummer" minLength={2} maxLength={100} autoComplete="off" inputMode="search" enterKeyHint="search" autoCapitalize="none" spellCheck={false} disabled={busy} />
      <button className="search-submit" type="submit" aria-label="Sök plats" disabled={busy || query.trim().length < 2}><ArrowIcon /></button>
    </form>
    <p className="privacy-line"><span aria-hidden="true">●</span> Din exakta position sparas aldrig.</p>
  </div>;
}
