import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useJobProfile } from '../store/jobProfileStore';

interface Props {
  periodId: string;
  onClose: () => void;
}

export function SlettTidsperiodeDialog({ periodId, onClose }: Props) {
  const deleteTimePeriod = useJobProfile((s) => s.deleteTimePeriod);

  // ESC to close + scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function handleConfirm() {
    deleteTimePeriod(periodId);
    onClose();
  }

  const dialog = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="slett-tidsperiode-title"
    >
      <div className="flex w-full max-w-[357px] flex-col overflow-hidden rounded-[16px] bg-surface shadow-xl">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-ink-200 px-8 py-4">
          <h2 id="slett-tidsperiode-title" className="text-xl font-medium text-ink-600">
            Vil du slette tidsperioden?
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Lukk"
            className="rounded-full p-1 text-brand-500 transition hover:bg-brand-50"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </header>

        {/* Content */}
        <div className="px-8 py-6">
          <p className="text-base font-light text-ink-800">
            Tidsperioden og tilhørende innstillinger fjernes permanent.
          </p>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-end border-t border-ink-200 px-8 py-4">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex h-12 items-center rounded-full bg-[#C70505] px-6 text-lg font-medium text-white transition hover:bg-[#a80404]"
          >
            Slett tidsperiode
          </button>
        </footer>

      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
