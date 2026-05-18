import { Users, MoreHorizontal } from 'lucide-react';

interface IKoRow {
  id: string;
  name: string;
  sub?: string;
  ko: string;
  tid: string | null;
  vip: boolean;
}

const ROWS: IKoRow[] = [
  { id: '1', name: 'Hedda Haugen',           sub: 'Tildelt operatør', ko: 'Resepsjon',    tid: null,    vip: false },
  { id: '2', name: 'Lucas Jørgensen Varberg', sub: undefined,          ko: 'Kundeservice', tid: '24:38', vip: true  },
  { id: '3', name: 'Isak Lie',                sub: undefined,          ko: 'Kundeservice', tid: '19:31', vip: false },
];

export function IKoPanel() {
  return (
    <section className="flex flex-1 flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[0_2px_8px_rgba(24,34,63,0.06)]">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-ink-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <Users size={18} strokeWidth={1.5} className="text-ink-500" />
          <h2 className="text-base font-medium text-ink-800">I kø</h2>
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
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3">

        {/* Column headers */}
        <div className="flex items-center gap-x-4 px-4">
          <span className="flex-1 text-sm font-semibold text-ink-800">Navn</span>
          <span className="w-24 text-sm font-semibold text-ink-800">Kø</span>
          <span className="w-12 text-sm font-semibold text-ink-800">Tid</span>
          <span className="w-10 text-sm font-semibold text-ink-800">VIP</span>
        </div>

        {/* Rows */}
        {ROWS.map((row) => (
          <div
            key={row.id}
            className={`flex items-center gap-x-4 rounded-lg px-4 py-3 ${
              row.vip ? 'bg-rose-50' : 'bg-ink-100'
            }`}
          >
            {/* Name */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="truncate text-sm text-ink-800">{row.name}</p>
              {row.sub && (
                <p className="whitespace-nowrap text-xs font-light text-ink-400">{row.sub}</p>
              )}
            </div>

            {/* Kø */}
            <span className="w-24 text-sm font-light text-ink-800">{row.ko}</span>

            {/* Tid */}
            <span className={`w-12 text-sm text-ink-800 ${row.vip ? 'font-semibold' : 'font-light'}`}>
              {row.tid ?? '–'}
            </span>

            {/* VIP badge */}
            <span className="w-10">
              {row.vip && (
                <span className="rounded-[4px] bg-brand-500 px-2 py-0.5 text-xs font-medium text-white">
                  VIP
                </span>
              )}
            </span>
          </div>
        ))}

      </div>
    </section>
  );
}
