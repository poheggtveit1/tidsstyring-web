import { useState } from 'react';
import {
  Search, SlidersHorizontal,
  ArrowDown, Phone, MessageSquare, PhoneForwarded, Voicemail,
  MoreHorizontal,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Avatar } from './Avatar';
import { CONTACTS } from '../data/contacts';

type CatalogueTab = 'Bedriftskatalog' | 'Favoritter' | 'Køanrop' | 'Meldingslogg' | 'Nummeropplysning';

const TABS: CatalogueTab[] = ['Bedriftskatalog', 'Favoritter', 'Køanrop', 'Meldingslogg', 'Nummeropplysning'];

/** Microsoft Teams presence icon */
function TeamsIcon() {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" aria-label="Microsoft Teams">
      <path d="M23.2139 9C23.7662 9 24.2139 9.44772 24.2139 10V16C24.2139 18.2091 22.423 20 20.2139 20C18.0047 20 16.2139 18.2091 16.2139 16V10C16.2139 9.44772 16.6616 9 17.2139 9H23.2139Z" fill="#5059C9"/>
      <path d="M20.7139 3C22.0946 3 23.2139 4.11929 23.2139 5.5C23.2139 6.88071 22.0946 8 20.7139 8C19.3332 8 18.2139 6.88071 18.2139 5.5C18.2139 4.11929 19.3332 3 20.7139 3Z" fill="#5059C9"/>
      <path d="M17.2139 9C17.7662 9 18.2139 9.44772 18.2139 10V17H18.1904C18.2053 17.1647 18.2139 17.3314 18.2139 17.5C18.2139 20.5376 15.7514 23 12.7139 23C9.6763 23 7.21387 20.5376 7.21387 17.5C7.21387 17.3314 7.22246 17.1647 7.2373 17H7.21387V10C7.21387 9.44772 7.66158 9 8.21387 9H17.2139Z" fill="#7B83EB"/>
      <path d="M12.7139 1C14.6469 1 16.2139 2.567 16.2139 4.5C16.2139 6.433 14.6469 8 12.7139 8C10.7809 8 9.21387 6.433 9.21387 4.5C9.21387 2.567 10.7809 1 12.7139 1Z" fill="#7B83EB"/>
      <rect x="0.213867" y="6" width="12" height="12" rx="0.428571" fill="#37C65D" stroke="white" strokeWidth="0.428571"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.33862 10.5883C8.49311 10.7263 8.50653 10.9633 8.36859 11.1178L6.02484 13.7428C5.9537 13.8225 5.85194 13.868 5.74512 13.868C5.63829 13.868 5.53654 13.8225 5.46539 13.7428L4.05914 12.1678C3.9212 12.0133 3.93462 11.7763 4.08911 11.6383C4.2436 11.5004 4.48066 11.5138 4.61859 11.6683L5.74512 12.93L7.80914 10.6183C7.94708 10.4638 8.18413 10.4504 8.33862 10.5883Z" fill="white"/>
    </svg>
  );
}


export function CataloguePanel() {
  const [activeTab, setActiveTab] = useState<CatalogueTab>('Bedriftskatalog');
  const [search, setSearch] = useState('');
  const filtered = CONTACTS.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  return (
    <section className="flex flex-1 flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[0_2px_8px_rgba(24,34,63,0.06)]">

      {/* ── Tabs ── */}
      <div className="flex items-center justify-between border-b border-ink-300 px-4">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex h-[58px] shrink-0 items-end pb-4 px-4 text-lg font-light transition border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-brand-500 text-brand-500'
                  : 'border-ink-300 text-ink-600 hover:text-ink-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Mer"
          className="shrink-0 rounded-full p-1 text-brand-500 hover:bg-brand-50 transition"
        >
          <MoreHorizontal size={18} strokeWidth={2} />
        </button>
      </div>

      {/* ── Search + controls ── */}
      <div className="flex items-center gap-3 border-b border-ink-300 px-4 py-6">
        {/* Search */}
        <div className="relative w-1/2">
          <Search
            size={18}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk på navn, nummer..."
            className="h-[50px] w-full rounded-[var(--radius-field)] border border-ink-200 bg-surface pl-10 pr-4 text-sm font-light text-ink-800 placeholder:text-ink-400 outline-none transition focus:border-brand-500"
          />
        </div>

        {/* Filter */}
        <button
          type="button"
          className="flex h-[50px] shrink-0 items-center gap-2 rounded-full bg-brand-50 px-5 text-sm font-medium text-brand-500 hover:bg-brand-100 transition"
        >
          <SlidersHorizontal size={16} strokeWidth={2} />
          Filter
        </button>

      </div>


{/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-separate border-spacing-y-1 px-4 pt-2">
          <colgroup>
            {/* Avatar */}
            <col style={{ width: '52px' }} />
            {/* Status badge */}
            <col style={{ width: '96px' }} />
            {/* Teams */}
            <col style={{ width: '72px' }} />
            {/* VIP */}
            <col style={{ width: '60px' }} />
            {/* Fornavn — fluid */}
            <col />
            {/* Etternavn — fluid */}
            <col />
            {/* Telefonnummer */}
            <col style={{ width: '160px' }} />
            {/* Avdeling — fluid */}
            <col />
          </colgroup>

          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="text-left text-sm font-medium text-ink-600">
              <th colSpan={2} className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Teams</th>
              <th className="px-2 py-2">VIP</th>
              <th className="px-2 py-2">
                <span className="inline-flex items-center gap-1">
                  Fornavn
                  <ArrowDown size={13} strokeWidth={2} />
                </span>
              </th>
              <th className="px-2 py-2">Etternavn</th>
              <th className="px-2 py-2">Telefonnummer</th>
              <th className="px-2 py-2">Avdeling</th>
            </tr>
            {/* Divider */}
            <tr aria-hidden>
              <td colSpan={8} className="h-px bg-ink-200 p-0" />
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="h-12 cursor-pointer transition-colors [&>td]:bg-[#F9F9FB] hover:[&>td]:!bg-surface-alt"
                >
                  {/* Avatar */}
                  <td className="rounded-l-lg px-1">
                    <Avatar initial={c.initial} size="sm" status={c.status} />
                  </td>

                  {/* Status badge */}
                  <td className="px-2">
                    <StatusBadge status={c.status} />
                  </td>

                  {/* Teams */}
                  <td className="px-2">
                    {c.hasTeams && <TeamsIcon />}
                  </td>

                  {/* VIP */}
                  <td className="px-2">
                    {c.vip && (
                      <span className="inline-flex items-center rounded bg-[#1C16C5] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[#83FCFC]">
                        VIP
                      </span>
                    )}
                  </td>

                  {/* Fornavn */}
                  <td className="px-2 text-sm font-light text-ink-800 truncate max-w-0">
                    <div className="truncate">{c.firstName}</div>
                  </td>

                  {/* Etternavn */}
                  <td className="px-2 text-sm font-light text-ink-800 truncate max-w-0">
                    <div className="truncate">{c.lastName}</div>
                  </td>

                  {/* Telefonnummer */}
                  <td className="px-2 text-sm font-light tabular-nums text-ink-800">
                    {c.phone}
                  </td>

                  {/* Avdeling */}
                  <td className="rounded-r-lg px-2 text-sm font-light text-ink-800 truncate max-w-0">
                    <div className="truncate">{c.department}</div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Action bar ── */}
      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-ink-300 px-4 py-4">
        <ActionButton icon={Phone} label="Ring (F2)" variant="call" />
        <ActionButton icon={PhoneForwarded} label="Sett over (F5)" variant="disabled" />
        <ActionButton icon={PhoneForwarded} label="Konsulter (F2)" variant="disabled" />
        <ActionButton icon={Voicemail} label="Til mobilsvar (F10)" variant="disabled" />
        <ActionButton icon={MessageSquare} label="Melding (F8)" variant="primary" />
      </div>
    </section>
  );
}

function ActionButton({
  icon: Icon,
  label,
  variant,
}: {
  icon: React.ElementType;
  label: string;
  variant: 'call' | 'primary' | 'disabled';
}) {
  const styles = {
    call:     'bg-[#178122] text-[#F5FFFF] hover:bg-[#1a9428]',
    primary:  'bg-brand-500 text-[#F5FFFF] hover:bg-brand-600',
    disabled: 'bg-ink-200 text-[#B2BAD1] cursor-not-allowed',
  };
  return (
    <button
      type="button"
      disabled={variant === 'disabled'}
      className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition ${styles[variant]}`}
    >
      <Icon size={15} strokeWidth={2} />
      {label}
    </button>
  );
}
