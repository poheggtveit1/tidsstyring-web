import { useEffect, useRef, useState } from 'react';
import { Clock, Headphones, MoreHorizontal, MoreVertical, PhoneForwarded } from 'lucide-react';
import { useJobProfile } from '../store/jobProfileStore';
import { Toggle } from './Toggle';
import { computeTidsstyringStatus } from '../utils/tidsstyringStatus';

interface Props {
  onOpenTidsstyring?: () => void;
}

export function MineKoerPanel({ onOpenTidsstyring }: Props) {
  const queues               = useJobProfile((s) => s.queues);
  const toggleQueueActive    = useJobProfile((s) => s.toggleQueueActive);
  const tidsstyringConfigured = useJobProfile((s) => s.tidsstyringConfigured);
  const tidsstyringActive    = useJobProfile((s) => s.tidsstyringActive);
  const timePeriods          = useJobProfile((s) => s.timePeriods);

  const activeQueueIds = queues.filter((q) => q.active).map((q) => q.id);
  const { prevLabel, nextLabel } = computeTidsstyringStatus(timePeriods, tidsstyringActive, activeQueueIds);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <section className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[0_2px_8px_rgba(24,34,63,0.06)]">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-ink-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <Headphones size={18} strokeWidth={1.5} className="text-ink-500" />
          <h2 className="text-base font-medium text-ink-800">Mine køer</h2>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="rounded-full p-1 text-brand-500 transition hover:bg-brand-50"
            aria-label="Alternativer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MoreVertical size={18} strokeWidth={2} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-[220px] overflow-hidden rounded-[8px] bg-white shadow-[0_2px_8px_rgba(0,26,102,0.10),0_4px_16px_rgba(0,26,102,0.05)]">
              <button
                type="button"
                className="flex h-[49px] w-full items-center gap-2 border-x border-t border-[#7C88AB]/30 px-5 text-base font-light text-ink-800 transition hover:bg-surface-alt"
                onClick={() => setMenuOpen(false)}
              >
                <PhoneForwarded size={16} strokeWidth={1.5} className="text-ink-500" />
                Anropsdistribusjon
              </button>
              <button
                type="button"
                className="flex h-[49px] w-full items-center gap-2 border-x border-t border-b border-[#7C88AB]/30 px-5 text-base font-light text-ink-800 transition hover:bg-surface-alt"
                onClick={() => { setMenuOpen(false); onOpenTidsstyring?.(); }}
              >
                <Clock size={16} strokeWidth={1.5} className="text-ink-500" />
                Tidsstyring
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tidsstyring status */}
      {tidsstyringConfigured && (
        <div className="flex flex-col gap-1.5 pl-11 pr-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm font-medium text-ink-800">Tidsstyring</span>
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${tidsstyringActive ? 'bg-[#178222]' : 'bg-ink-400'}`} />
              <span className="text-sm font-light text-ink-600">{tidsstyringActive ? 'På' : 'Av'}</span>
            </div>
          </div>
          {tidsstyringActive && prevLabel && (
            <div className="flex items-baseline text-sm font-light">
              <span className="shrink-0 text-ink-500">Gjeldende:</span>
              <span className="flex-1 text-right text-ink-800">{prevLabel}</span>
            </div>
          )}
          {tidsstyringActive && nextLabel && (
            <div className="flex items-baseline text-sm font-light">
              <span className="shrink-0 text-ink-500">Neste:</span>
              <span className="flex-1 text-right text-ink-800">{nextLabel}</span>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col gap-2 px-4 py-3">

        {/* Column headers */}
        <div className="flex items-center gap-x-4 px-4">
          {/* Spacer for toggle column */}
          <span className="w-9 shrink-0" />
          <span className="flex-1 text-sm font-semibold text-ink-800">Kønavn ↓</span>
          <span className="w-8 text-center text-sm font-semibold text-ink-800">I kø</span>
          <span className="w-12 text-sm font-semibold text-ink-800">Tid</span>
          <span className="w-12 text-sm font-semibold text-ink-800">Operatører</span>
          {/* Spacer for ··· column */}
          <span className="w-6 shrink-0" />
        </div>

        {/* Rows */}
        {queues.map((q) => (
          <div
            key={q.id}
            className="flex items-center gap-x-4 rounded-lg bg-ink-100 px-4 py-3"
          >
            {/* Toggle */}
            <Toggle
              on={q.active}
              onChange={() => toggleQueueActive(q.id)}
              size="md"
              ariaLabel={`Aktiver ${q.name}`}
            />

            {/* Name */}
            <span className="flex-1 min-w-0 truncate text-sm text-ink-800">{q.name}</span>

            {/* I kø */}
            <span className="w-8 text-center text-sm font-light text-ink-800">
              {q.inQueue ?? '–'}
            </span>

            {/* Tid */}
            <span className="w-12 text-sm font-light text-ink-800">
              {q.waitTime ?? '–'}
            </span>

            {/* Operatører */}
            <span className="w-12 text-sm font-light text-ink-800">
              {q.operatorsActive} / {q.operatorsTotal}
            </span>

            {/* Row actions */}
            <button
              type="button"
              className="w-6 shrink-0 rounded-full p-0.5 text-brand-500 transition hover:bg-brand-50"
              aria-label={`Alternativer for ${q.name}`}
            >
              <MoreHorizontal size={16} strokeWidth={1.5} />
            </button>
          </div>
        ))}

      </div>
    </section>
  );
}
