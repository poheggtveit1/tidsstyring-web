import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useJobProfile } from '../store/jobProfileStore';

interface Props {
  onClose: () => void;
  onEndreTidsstyring: () => void;
}

export function TidsstyrtPaaloggingDialog({ onClose, onEndreTidsstyring }: Props) {
  const queues = useJobProfile((s) => s.queues);
  const displayNumbers = useJobProfile((s) => s.displayNumbers);
  const selectedDisplayNumberId = useJobProfile((s) => s.selectedDisplayNumberId);

  const activeQueues = queues.filter((q) => q.active);
  const selectedNumber = displayNumbers.find((n) => n.id === selectedDisplayNumberId);

  const dialog = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-900/50" onClick={onClose} aria-hidden="true" />

      {/* Card */}
      <div className="relative w-full max-w-[640px] overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[0_8px_32px_rgba(24,34,63,0.16)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-xl font-medium text-ink-800">Tidsstyrt pålogging</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Lukk"
            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-500 hover:bg-brand-50 transition"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="border-t border-ink-200" />

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-6">
          <p className="text-base font-light text-ink-800">
            Du har nå blitt logget på følgende køer:
          </p>

          <ul className="flex flex-col gap-1 pl-2">
            {activeQueues.map((q) => (
              <li key={q.id} className="flex items-center gap-2 text-base font-light text-ink-800">
                <span className="text-ink-400">·</span>
                {q.name} ({q.number})
              </li>
            ))}
          </ul>

          {selectedNumber && (
            <p className="text-base font-light text-ink-800">
              Valgt visningsnummer: {selectedNumber.label} ({selectedNumber.number})
            </p>
          )}
        </div>

        <div className="border-t border-ink-200" />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button
            type="button"
            onClick={onEndreTidsstyring}
            className="flex h-10 items-center rounded-full bg-ink-100 px-5 text-sm font-medium text-ink-800 transition hover:bg-ink-200"
          >
            Endre tidsstyring
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center rounded-full bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Supert
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
