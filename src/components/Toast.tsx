import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';

interface Props {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: Props) {
  return createPortal(
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className="pointer-events-auto"
        style={{ animation: 'slide-up-toast 260ms cubic-bezier(0.32,0,0.08,1) both' }}
      >
        <div className="flex items-center gap-2.5 rounded-[8px] bg-[#D8FDDC] px-4 py-3 shadow-[0_4px_16px_rgba(24,34,63,0.12)]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#24A831]">
            <Check size={14} strokeWidth={3} className="text-white" />
          </div>
          <p
            className="flex-1 whitespace-nowrap text-base font-light leading-snug"
            style={{ color: 'rgb(17,69,22)' }}
          >
            {message}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Lukk"
            className="shrink-0 transition hover:opacity-60"
            style={{ color: 'rgb(0,11,46)' }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
