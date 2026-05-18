import { Headphones, MoreHorizontal } from 'lucide-react';
import { useJobProfile } from '../store/jobProfileStore';
import { Toggle } from './Toggle';

export function MineKoerPanel() {
  const queues            = useJobProfile((s) => s.queues);
  const toggleQueueActive = useJobProfile((s) => s.toggleQueueActive);

  return (
    <section className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[0_2px_8px_rgba(24,34,63,0.06)]">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-ink-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <Headphones size={18} strokeWidth={1.5} className="text-ink-500" />
          <h2 className="text-base font-medium text-ink-800">Mine køer</h2>
        </div>
        <button
          type="button"
          className="rounded-full p-1 text-brand-500 transition hover:bg-brand-50"
          aria-label="Alternativer"
        >
          <MoreHorizontal size={18} strokeWidth={1.5} />
        </button>
      </header>

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
