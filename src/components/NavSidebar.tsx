import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight, Settings, LifeBuoy,
  Megaphone, Download, LogOut, ArrowLeftRight, User, RotateCcw, Play,
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onReset: () => void;
  onSimulate: () => void;
}

export function NavSidebar({ onClose, onReset, onSimulate }: Props) {
  const [closing, setClosing] = useState(false);
  const afterCloseRef = useRef<(() => void) | null>(null);

  const handleClose = useCallback((afterClose?: () => void) => {
    afterCloseRef.current = afterClose ?? null;
    setClosing(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [handleClose]);

  function handleAnimationEnd() {
    if (closing) {
      const cb = afterCloseRef.current;
      onClose();
      cb?.();
    }
  }

  const sidebar = (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-900/50" onClick={() => handleClose()} aria-hidden="true" />

      {/* Drawer */}
      <div
        className="relative flex h-full w-[400px] max-w-[90vw] flex-col justify-between bg-[#070452] px-16 py-16 overflow-y-auto"
        style={{
          animation: closing
            ? 'slide-out-left 220ms cubic-bezier(0.32,0,0.08,1) both'
            : 'slide-in-left 260ms cubic-bezier(0.32,0,0.08,1) both',
        }}
        onAnimationEnd={handleAnimationEnd}
      >

        {/* ── Main content ── */}
        <div className="flex flex-col gap-10">

          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-200">
              <span className="text-xl font-medium text-amber-800">A</span>
              <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#070452] bg-[#178222]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-medium text-white">Firstname Lastname</span>
              <button type="button" className="flex items-center gap-1.5 text-left text-sm font-light text-white/70 transition hover:text-white">
                <User size={14} strokeWidth={1.75} />
                Min profil
              </button>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-7">

            {/* MBN Sentralbord + sub-items */}
            <div className="flex flex-col gap-3">
              <button type="button" className="flex items-center justify-between text-left text-lg font-medium text-[#F5FFFF] transition hover:opacity-70">
                MBN Sentralbord
                <ArrowRight size={20} strokeWidth={1.75} className="shrink-0 text-white/60" />
              </button>
              <button type="button" className="flex items-center gap-3 pl-1 text-left text-sm font-light text-white/70 transition hover:text-white">
                <Settings size={16} strokeWidth={1.75} className="shrink-0" />
                Innstillinger
              </button>
              <button type="button" className="flex items-center gap-3 pl-1 text-left text-sm font-light text-white/70 transition hover:text-white">
                <LifeBuoy size={16} strokeWidth={1.75} className="shrink-0" />
                Hjelp
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button type="button" className="flex items-center justify-between text-left text-lg font-medium text-[#F5FFFF] transition hover:opacity-70">
                Mitt MBN
                <ArrowRight size={20} strokeWidth={1.75} className="shrink-0 text-white/60" />
              </button>
              <button
                type="button"
                onClick={() => handleClose(onSimulate)}
                className="flex items-center gap-3 pl-1 text-left text-sm font-light text-white/70 transition hover:text-white"
              >
                <Play size={16} strokeWidth={1.75} className="shrink-0" />
                Simuler tidsstyring dialog
              </button>
            </div>

          </nav>
        </div>

        {/* ── Secondary content ── */}
        <div className="flex flex-col gap-8">

          {/* Feedback + install + reset */}
          <div className="flex flex-col gap-4">
            <button type="button" className="flex items-center gap-3 text-left text-sm font-medium text-[#F5FFFF] transition hover:opacity-70">
              <Megaphone size={16} strokeWidth={1.75} className="shrink-0" />
              Gi tilbakemelding
            </button>
            <button type="button" className="flex items-center gap-3 text-left text-sm font-medium text-[#F5FFFF] transition hover:opacity-70">
              <Download size={16} strokeWidth={1.75} className="shrink-0" />
              Installer som app
            </button>
            <button
              type="button"
              onClick={() => handleClose(onReset)}
              className="flex items-center gap-3 text-left text-sm font-medium text-[#F5FFFF] transition hover:opacity-70"
            >
              <RotateCcw size={16} strokeWidth={1.75} className="shrink-0" />
              Nullstill prototype
            </button>
          </div>

          {/* Logg ut + Bytt bruker — blue pill buttons */}
          <div className="flex flex-row gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap transition hover:bg-brand-600"
            >
              <LogOut size={15} strokeWidth={2} />
              Logg ut
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap transition hover:bg-brand-600"
            >
              <ArrowLeftRight size={15} strokeWidth={2} />
              Bytt bruker
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return createPortal(sidebar, document.body);
}
