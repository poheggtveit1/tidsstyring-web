import { useState } from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { useJobProfile } from '../store/jobProfileStore';
import { computeTidsstyringStatus, getUpcomingPeriod } from '../utils/tidsstyringStatus';

interface Props {
  onStart: () => void;
  queuesReadOnly?: boolean;
}

const RING_PROFILE = [
  { label: 'Kontaktnummer', number: '916 88 677' },
  { label: 'Tvilling',      number: '478 33 684' },
  { label: 'Softphone',     number: '67 13 67 04' },
];

export function SentralbordStartPage({ onStart, queuesReadOnly }: Props) {
  const queues                = useJobProfile((s) => s.queues);
  const setQueuesActive       = useJobProfile((s) => s.setQueuesActive);
  const lastSessionQueueIds   = useJobProfile((s) => s.lastSessionQueueIds);
  const tidsstyringActive     = useJobProfile((s) => s.tidsstyringActive);
  const tidsstyringConfigured = useJobProfile((s) => s.tidsstyringConfigured);
  const timePeriods           = useJobProfile((s) => s.timePeriods);

  // Compute upcoming period before useState so we can use it for the initial selection
  const upcomingPeriod = (tidsstyringConfigured && tidsstyringActive)
    ? getUpcomingPeriod(timePeriods)
    : null;

  // Pre-select: upcoming period (< 60 min) → last session → all unchecked
  const [selected, setSelected] = useState<Record<string, boolean>>(
    upcomingPeriod
      ? Object.fromEntries(
          Object.entries(upcomingPeriod.queueAssignments).map(([id, qs]) => [id, qs.loggedIn])
        )
      : Object.fromEntries(queues.map((q) => [q.id, lastSessionQueueIds.includes(q.id)]))
  );

  const activeQueueIds = queues.filter((q) => q.active).map((q) => q.id);
  const { prevLabel, nextLabel } = computeTidsstyringStatus(timePeriods, tidsstyringActive, activeQueueIds);

  function toggleQueue(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleStart() {
    setQueuesActive(selected);
    onStart();
  }

  return (
    <div className="relative flex flex-1 overflow-y-auto p-8 bg-surface-alt">

<div className="flex flex-col gap-8 max-w-[560px]">

        {/* Greeting */}
        <div>
          <h1 className="text-4xl font-light text-ink-800 leading-tight">God dag,</h1>
          <h1 className="text-4xl font-light text-ink-800 leading-tight">Kari Nordmann!</h1>
        </div>

        {/* Tidsstyring status — only if configured */}
        {tidsstyringConfigured && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Clock size={15} strokeWidth={1.5} className="text-ink-500" />
              <div className={`h-2 w-2 rounded-full ${tidsstyringActive ? 'bg-[#178222]' : 'bg-ink-400'}`} />
              <span className="text-sm font-medium text-ink-800">
                Tidsstyring {tidsstyringActive ? 'er aktiv' : 'er av'}
              </span>
            </div>

            {tidsstyringActive && (prevLabel || nextLabel) && (
              <div className="flex flex-col gap-1 pl-[23px]">
                {prevLabel && (
                  <div className="flex items-baseline gap-2 text-sm font-light">
                    <span className="w-20 shrink-0 text-ink-500">Gjeldende:</span>
                    <span className="text-ink-800">{prevLabel}</span>
                  </div>
                )}
                {nextLabel && (
                  <div className="flex items-baseline gap-2 text-sm font-light">
                    <span className="w-20 shrink-0 text-ink-500">Neste:</span>
                    <span className="text-ink-800">{nextLabel}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm font-light text-ink-500 pl-[23px]">
              {upcomingPeriod || tidsstyringActive
                ? 'Tidsstyring har valgt køene nedenfor.'
                : 'Køene er valgt fra forrige økt.'}
            </p>
          </div>
        )}

        {/* Queue selection */}
        <div className="flex flex-col gap-3">
          {queuesReadOnly ? (
            /* Active period — read-only */
            <>
              <p className="text-sm font-medium text-brand-500">Køer du er logget på av tidsstyringen</p>
              {queues.filter((q) => q.active).map((q) => (
                <span key={q.id} className="text-sm text-ink-800">{q.name} ({q.number})</span>
              ))}
            </>
          ) : (
            /* Editable checkboxes — pre-selected from upcoming period or last session */
            <>
              <p className="text-sm font-medium text-brand-500">Velg hvilke køer du vil betjene</p>
              {queues.map((q) => (
                <label key={q.id} className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selected[q.id] ?? false}
                    onChange={() => toggleQueue(q.id)}
                    className="h-4 w-4 rounded accent-brand-500 cursor-pointer"
                  />
                  <span className="text-sm text-ink-800">{q.name} ({q.number})</span>
                </label>
              ))}
            </>
          )}
        </div>

        {/* Ring profile */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-brand-500">
            Du besvarer kø-anropene med denne ringeprofilen:
          </p>
          <div className="rounded-lg border border-ink-200 bg-surface p-4 max-w-[400px] shadow-sm">
            <p className="text-sm font-medium text-ink-800 mb-3">Rekkefølge mine telefoner ringer</p>
            <ol className="flex flex-col gap-1.5">
              {RING_PROFILE.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-ink-800">
                  <span className="text-ink-400 tabular-nums">{i + 1}</span>
                  <span>{item.number} ({item.label})</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition"
            >
              Endre hvordan du besvarer kø-anrop
              <ChevronRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Start button */}
        <div>
          <button
            type="button"
            onClick={handleStart}
            className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-base font-medium text-white hover:bg-brand-600 transition"
          >
            Start sentralbord
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>

      </div>
    </div>
  );
}
