import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock } from 'lucide-react';
import { useJobProfile } from '../store/jobProfileStore';
import { computeTidsstyringStatus } from '../utils/tidsstyringStatus';

interface Props {
  onClose: () => void;
  onAvslutt: (opts: { logoutQueues: boolean; logoutUser: boolean }) => void;
}

export function AvsluttDialog({ onClose, onAvslutt }: Props) {
  const [queueChoice, setQueueChoice] = useState<'logg-ut' | 'forbli'>('logg-ut');
  const [logoutUser, setLogoutUser] = useState(false);

  const tidsstyringActive    = useJobProfile((s) => s.tidsstyringActive);
  const tidsstyringConfigured = useJobProfile((s) => s.tidsstyringConfigured);
  const timePeriods          = useJobProfile((s) => s.timePeriods);
  const queues               = useJobProfile((s) => s.queues);
  const activeQueueIds       = queues.filter((q) => q.active).map((q) => q.id);
  const { prevLabel, nextLabel } = computeTidsstyringStatus(timePeriods, tidsstyringActive, activeQueueIds);

  function handleAvslutt() {
    onAvslutt({ logoutQueues: queueChoice === 'logg-ut', logoutUser });
    onClose();
  }

  const dialog = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-lg font-medium text-ink-800">Avslutt MBN</h2>

        {/* Tidsstyring status */}
        {tidsstyringConfigured && (
          <div className="mb-5 flex flex-col gap-1.5 rounded-lg bg-ink-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock size={14} strokeWidth={1.5} className="text-ink-500" />
              <div className={`h-2 w-2 rounded-full ${tidsstyringActive ? 'bg-[#178222]' : 'bg-ink-400'}`} />
              <span className="text-sm font-medium text-ink-800">
                Tidsstyring {tidsstyringActive ? 'er aktiv' : 'er av'}
              </span>
            </div>
            {tidsstyringActive && prevLabel && (
              <div className="flex items-baseline gap-2 pl-[22px] text-sm font-light">
                <span className="w-20 shrink-0 text-ink-500">Gjeldende:</span>
                <span className="text-ink-800">{prevLabel}</span>
              </div>
            )}
            {tidsstyringActive && nextLabel && (
              <div className="flex items-baseline gap-2 pl-[22px] text-sm font-light">
                <span className="w-20 shrink-0 text-ink-500">Neste:</span>
                <span className="text-ink-800">{nextLabel}</span>
              </div>
            )}
          </div>
        )}

        {/* Radio options */}
        <div className="flex flex-col gap-3 mb-5">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="radio"
              name="queue-choice"
              checked={queueChoice === 'logg-ut'}
              onChange={() => setQueueChoice('logg-ut')}
              className="accent-brand-500"
            />
            <span className="text-sm text-ink-800">Logg meg ut av køene mine</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="radio"
              name="queue-choice"
              checked={queueChoice === 'forbli'}
              onChange={() => setQueueChoice('forbli')}
              className="accent-brand-500"
            />
            <span className="text-sm text-ink-800">Forbli pålogget køene mine</span>
          </label>
        </div>

        {/* Tidsstyring help text */}
        {tidsstyringActive && (
          <p className="mb-4 text-sm font-light text-ink-500">
            Tidsstyringen vil fortsatt være aktiv selv om du velger å logge ut eller forbli pålogget.
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-ink-200 mb-4" />

        {/* Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer select-none mb-6">
          <input
            type="checkbox"
            checked={logoutUser}
            onChange={(e) => setLogoutUser(e.target.checked)}
            className="h-4 w-4 rounded accent-brand-500 cursor-pointer"
          />
          <span className="text-sm text-ink-800">Logg meg også helt ut som bruker</span>
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-ink-800 hover:bg-ink-100 transition"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={handleAvslutt}
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition"
          >
            Avslutt
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
