import { ArrowDown, MoreHorizontal } from 'lucide-react';
import { useJobProfile } from '../store/jobProfileStore';
import { Toggle } from './Toggle';

export function QueueTable() {
  const queues = useJobProfile((s) => s.queues);
  const toggle = useJobProfile((s) => s.toggleQueueActive);

  return (
    <div className="flex flex-1 flex-col overflow-hidden pb-2">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-base font-medium text-ink-600">Mine køer</h3>
      </div>

      {/* Fills remaining height, scrolls if queues overflow */}
      <div className="flex-1 overflow-y-auto overflow-x-auto px-2">
        <table className="w-full min-w-[260px] border-separate border-spacing-y-1.5">
          <colgroup>
            {/* Toggle */}
            <col className="w-[52px]" />
            {/* Name — fluid */}
            <col />
            {/* I kø — hidden below ~340px via @container or just stays narrow */}
            <col className="w-[42px]" />
            {/* Tid — hidden on very narrow */}
            <col className="w-[48px]" />
            {/* Operatører */}
            <col className="w-[54px]" />
            {/* Menu */}
            <col className="w-[36px]" />
          </colgroup>
          <thead>
            <tr className="text-left text-sm font-medium text-ink-800">
              <th className="pb-1" />
              <th className="px-2 pb-1">
                <span className="inline-flex items-center gap-0.5">
                  Kønavn
                  <ArrowDown size={12} strokeWidth={2} />
                </span>
              </th>
              <th className="px-1 pb-1 text-right">I kø</th>
              <th className="px-1 pb-1 text-right">Tid</th>
              <th className="px-1 pb-1 text-right">Operatører</th>
              <th className="pb-1" />
            </tr>
          </thead>
          <tbody>
            {queues.map((q) => (
              <tr
                key={q.id}
                className={
                  'h-11 text-sm font-light text-ink-800 ' +
                  (q.paused ? '[&>td]:bg-surface-warn' : '[&>td]:bg-surface-alt')
                }
              >
                {/* Toggle */}
                <td className="rounded-l-[var(--radius-field)] pl-2">
                  <Toggle
                    on={q.active}
                    onChange={() => toggle(q.id)}
                    ariaLabel={`Aktiver kø ${q.name}`}
                    size="md"
                  />
                </td>

                {/* Name */}
                <td className="min-w-0 px-2">
                  <div className="truncate leading-tight">{q.name}</div>
                  <div className="truncate text-xs font-light text-ink-500 tabular-nums">
                    {q.paused ? 'På pause' : q.number}
                  </div>
                </td>

                {/* I kø */}
                <td className="px-1 text-right tabular-nums">
                  {q.inQueue ?? '–'}
                </td>

                {/* Tid */}
                <td className="px-1 text-right tabular-nums text-xs">
                  {q.waitTime ?? '–'}
                </td>

                {/* Operatører (abbreviated) */}
                <td className="px-1 text-right tabular-nums text-xs">
                  {q.operatorsActive}/{q.operatorsTotal}
                </td>

                {/* Menu */}
                <td className="rounded-r-[var(--radius-field)] pr-1 text-right">
                  <button
                    type="button"
                    className="rounded-full p-1 text-brand-500 transition hover:bg-brand-50"
                    aria-label="Flere valg"
                  >
                    <MoreHorizontal size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
