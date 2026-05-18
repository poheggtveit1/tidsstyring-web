import { ChevronDown, Calendar, ChevronUp, User } from 'lucide-react';
import { Toggle } from './Toggle';
import { useState } from 'react';

// Simple Microsoft Teams logo placeholder
function TeamsIcon() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#5059c9] text-white text-[10px] font-bold leading-none">
      T
    </span>
  );
}

export function MinStatusPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [utDagen, setUtDagen] = useState(false);

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
              <div className="flex h-[50px] items-center rounded-[var(--radius-field)] border border-ink-200 bg-surface px-3 text-base font-light text-ink-500">
                <span className="text-ink-400">Skriv en statusmelding…</span>
              </div>
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
