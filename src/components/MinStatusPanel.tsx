import { ChevronDown, Calendar, ChevronUp, User } from 'lucide-react';
import { Toggle } from './Toggle';
import { useState } from 'react';

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

export function MinStatusPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [utDagen, setUtDagen] = useState(false);
  const [statusText, setStatusText] = useState('');

  function handleStatusChange(value: string) {
    setStatusText(value);
    if (value.length > 0) setUtDagen(true);
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[0_2px_8px_rgba(24,34,63,0.06)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-ink-200">
        <div className="flex items-center gap-2 text-ink-600">
          <User size={20} strokeWidth={1.75} />
          <h2 className="text-xl font-medium">Min status</h2>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Utvid' : 'Skjul'}
          className="rounded-full p-1 text-brand-500 hover:bg-brand-50 transition"
        >
          {collapsed ? <ChevronDown size={18} strokeWidth={2} /> : <ChevronUp size={18} strokeWidth={2} />}
        </button>
      </header>

      {!collapsed && (
        <div className="flex flex-col gap-6 p-4">
          {/* Avatar row */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-lg font-semibold">
                A
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#178122]" />
              </div>
              {/* Status dropdown */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-alt transition"
                aria-label="Endre status"
              >
                <ChevronDown size={18} strokeWidth={2} className="text-ink-600" />
              </button>
              {/* Meeting info */}
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-medium text-ink-800">Eksternt møte til 31.10 10:30</span>
                <span className="text-xs font-light text-ink-600">Viderekoblet til Sentralbord</span>
              </div>
              {/* Calendar */}
              <button
                type="button"
                aria-label="Kalender"
                className="flex h-10 w-10 items-center justify-center rounded-full text-brand-500 hover:bg-brand-50 transition"
              >
                <Calendar size={18} strokeWidth={1.75} />
              </button>
            </div>

            {/* Teams status */}
            <div className="flex items-center gap-2">
              <TeamsIcon />
              <span className="text-base font-light text-ink-600">Tilgjengelig</span>
            </div>
          </div>

          {/* Status text + ut dagen */}
          <div className="flex items-end gap-4">
            {/* Text field */}
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-ink-600">Hva skjer i dag?</label>
              <input
                type="text"
                value={statusText}
                onChange={(e) => handleStatusChange(e.target.value)}
                placeholder="Skriv en statusmelding…"
                className="h-[50px] w-full rounded-[var(--radius-field)] border border-ink-200 bg-surface px-3 text-base font-light text-ink-800 placeholder:text-ink-400 outline-none transition focus:border-brand-500"
              />
            </div>

            {/* Ut dagen toggle */}
            <div className="flex flex-col items-center gap-2 pb-1">
              <span className="text-base font-medium text-ink-600 whitespace-nowrap">Ut dagen</span>
              <Toggle on={utDagen} onChange={setUtDagen} ariaLabel="Ut dagen" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
