import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check, Phone } from 'lucide-react';
import { useJobProfile } from '../store/jobProfileStore';

export function DisplayNumberDropdown() {
  const displayNumbers = useJobProfile((s) => s.displayNumbers);
  const selectedId = useJobProfile((s) => s.selectedDisplayNumberId);
  const setSelected = useJobProfile((s) => s.setSelectedDisplayNumber);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = displayNumbers.find((n) => n.id === selectedId);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-base font-medium text-ink-600">
        Visningsnummer
      </label>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-full items-center gap-2 rounded-[var(--radius-field)] border border-ink-200 bg-surface px-4 text-left text-[18px] font-light text-ink-600 outline-none transition focus-visible:border-brand-500 hover:border-ink-400"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <Phone size={18} className="text-ink-500" strokeWidth={1.5} />
          <span className="flex-1 truncate">
            {selected ? `${selected.label} (${selected.number})` : 'Velg visningsnummer'}
          </span>
          <ChevronDown
            size={20}
            className={`text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`}
            strokeWidth={1.5}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-[var(--radius-field)] border border-ink-200 bg-surface py-2 shadow-lg"
          >
            {displayNumbers.map((n) => {
              const active = n.id === selectedId;
              return (
                <li key={n.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(n.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-6 py-3 text-left text-[16px] font-light text-ink-800 hover:bg-surface-alt"
                  >
                    <Phone size={18} className="text-ink-500" strokeWidth={1.5} />
                    <span className="flex-1 truncate">
                      {n.label} <span className="text-ink-500">({n.number})</span>
                    </span>
                    {active && <Check size={18} className="text-brand-500" strokeWidth={2} />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
