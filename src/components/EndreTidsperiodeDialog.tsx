import { useEffect, useRef, useState } from 'react';
import { X, Clock, ChevronDown, Phone, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useJobProfile } from '../store/jobProfileStore';
import type { TimePeriod } from '../types/jobProfile';

const DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

interface QueueEdit {
  loggedIn: boolean;
  smsVarsling: boolean;
}

interface Props {
  onClose: () => void;
  period?: TimePeriod; // When provided, edit this specific period
}

export function EndreTidsperiodeDialog({ onClose, period }: Props) {
  // Store reads
  const tidsstyringTimeFrom = useJobProfile((s) => s.tidsstyringTimeFrom);
  const tidsstyringTimeTo   = useJobProfile((s) => s.tidsstyringTimeTo);
  const tidsstyringDays     = useJobProfile((s) => s.tidsstyringDays);
  const displayNumbers      = useJobProfile((s) => s.displayNumbers);
  const selectedDisplayNumberId = useJobProfile((s) => s.selectedDisplayNumberId);
  const externalOnly        = useJobProfile((s) => s.externalOnly);
  const queues              = useJobProfile((s) => s.queues);

  // Store writes
  const setTidsstyringTimeRange  = useJobProfile((s) => s.setTidsstyringTimeRange);
  const setTidsstyringDays       = useJobProfile((s) => s.setTidsstyringDays);
  const setSelectedDisplayNumber = useJobProfile((s) => s.setSelectedDisplayNumber);
  const setExternalOnly          = useJobProfile((s) => s.setExternalOnly);
  const setQueuesActive          = useJobProfile((s) => s.setQueuesActive);
  const deleteTidsstyring        = useJobProfile((s) => s.deleteTidsstyring);
  const updateTimePeriod         = useJobProfile((s) => s.updateTimePeriod);
  const deleteTimePeriod         = useJobProfile((s) => s.deleteTimePeriod);

  // Resolve initial values — period prop takes priority over flat store fields
  const initTimeFrom   = period?.timeFrom   ?? tidsstyringTimeFrom;
  const initTimeTo     = period?.timeTo     ?? tidsstyringTimeTo;
  const initDays       = period?.days       ?? tidsstyringDays;
  const initDisplayId  = period?.displayNumberId ?? selectedDisplayNumberId ?? 'mitt-nummer';
  const initExtOnly    = period?.externalOnly ?? externalOnly;
  const initQueueEdits = period
    ? Object.fromEntries(
        queues.map((q) => [
          q.id,
          {
            loggedIn:    period.queueAssignments[q.id]?.loggedIn    ?? false,
            smsVarsling: period.queueAssignments[q.id]?.smsVarsling ?? false,
          },
        ]),
      )
    : Object.fromEntries(queues.map((q) => [q.id, { loggedIn: q.active, smsVarsling: q.active }]));

  // Local edit state — initialised from period or store
  const [timeFrom, setTimeFrom] = useState(initTimeFrom);
  const [timeTo,   setTimeTo]   = useState(initTimeTo);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set(initDays));
  const [displayId, setDisplayId] = useState(initDisplayId);
  const [extOnly, setExtOnly]   = useState(initExtOnly);
  const [queueEdits, setQueueEdits] = useState<Record<string, QueueEdit>>(initQueueEdits);

  // Visningsnummer dropdown
  const [dropOpen, setDropOpen] = useState(false);
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef    = useRef<HTMLUListElement>(null);

  const selectedDN = displayNumbers.find((n) => n.id === displayId);
  const isMittNummer = displayId === 'mitt-nummer';

  function openDrop() {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setDropStyle({ position: 'fixed', top: r.bottom + 4, left: r.left, width: r.width, zIndex: 300 });
    }
    setDropOpen(true);
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!triggerRef.current?.contains(e.target as Node) && !listRef.current?.contains(e.target as Node))
        setDropOpen(false);
    }
    if (dropOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [dropOpen]);

  // Scroll lock + ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function toggleDay(day: string) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  function handleDisplayChange(id: string) {
    setDisplayId(id);
    setExtOnly(id !== 'mitt-nummer');
    setDropOpen(false);
  }

  function toggleQueue(queueId: string, field: 'loggedIn' | 'smsVarsling') {
    setQueueEdits((prev) => {
      const cur = prev[queueId];
      const next = { ...cur, [field]: !cur[field] };
      if (field === 'loggedIn') next.smsVarsling = next.loggedIn;
      return { ...prev, [queueId]: next };
    });
  }

  function handleSave() {
    const days = Array.from(selectedDays);
    const queueCount = Object.values(queueEdits).filter((q) => q.loggedIn).length;
    const assignments = Object.fromEntries(
      Object.entries(queueEdits).map(([id, q]) => [id, { loggedIn: q.loggedIn, smsVarsling: q.smsVarsling }]),
    );

    if (period) {
      // Multi-period path: update via the new action
      updateTimePeriod(period.id, {
        timeFrom,
        timeTo,
        days,
        displayNumberId: displayId,
        externalOnly: extOnly,
        queueAssignments: assignments,
      });
    } else {
      // Legacy path (wizard-created single period without id)
      setTidsstyringTimeRange(timeFrom, timeTo, queueCount);
      setTidsstyringDays(days);
      setSelectedDisplayNumber(displayId);
      if (displayId !== 'mitt-nummer') setExternalOnly(extOnly);
    }
    // Always sync live queue states
    setQueuesActive(Object.fromEntries(Object.entries(queueEdits).map(([id, q]) => [id, q.loggedIn])));
    onClose();
  }

  function handleDelete() {
    if (period) {
      deleteTimePeriod(period.id);
    } else {
      deleteTidsstyring();
    }
    onClose();
  }

  const dropdownPortal = dropOpen
    ? createPortal(
        <ul
          ref={listRef}
          role="listbox"
          style={dropStyle}
          className="max-h-64 overflow-auto rounded-lg border border-ink-200 bg-surface py-2 shadow-lg"
        >
          {displayNumbers.map((n) => {
            const active = n.id === displayId;
            return (
              <li key={n.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => handleDisplayChange(n.id)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-base font-light text-ink-800 hover:bg-surface-alt"
                >
                  <Phone size={18} strokeWidth={1.5} className="shrink-0 text-ink-500" />
                  <span className="flex-1 truncate">{n.label} <span className="text-ink-500">({n.number})</span></span>
                  {active && <Check size={16} strokeWidth={2} className="text-brand-500" />}
                </button>
              </li>
            );
          })}
        </ul>,
        document.body,
      )
    : null;

  const dialog = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="endre-tidsperiode-title"
    >
      <div className="flex w-full max-w-[800px] flex-col overflow-hidden rounded-[16px] bg-surface shadow-xl">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-ink-200 px-8 py-4">
          <h2 id="endre-tidsperiode-title" className="text-xl font-medium text-ink-600">
            Endre tidsperiode
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

        {/* Scrollable content */}
        <div className="flex flex-col gap-6 overflow-y-auto px-8 py-8" style={{ maxHeight: 'calc(100vh - 200px)' }}>

          {/* Time range */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-ink-600">Velg tidspunkt (fra - til)</label>
            <div className="flex items-center gap-3">
              <TimeInput value={timeFrom} onChange={setTimeFrom} ariaLabel="Fra" />
              <span className="text-base font-light text-ink-400">–</span>
              <TimeInput value={timeTo} onChange={setTimeTo} ariaLabel="Til" />
            </div>
          </div>

          {/* Day chips */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-ink-600">Velg dager</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const on = selectedDays.has(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`flex h-10 items-center gap-1 rounded-[24px] px-3 text-base font-light transition ${
                      on
                        ? 'bg-ink-900 text-white'
                        : 'bg-ink-200 text-ink-800 hover:bg-ink-300'
                    }`}
                  >
                    {day}
                    {on && <Check size={14} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visningsnummer */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-ink-600">
                Aktivt visningsnummer i perioden
              </label>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => dropOpen ? setDropOpen(false) : openDrop()}
                className="flex h-12 w-full max-w-[350px] items-center gap-2 rounded-lg border border-ink-200 bg-surface px-4 text-left text-lg font-light text-ink-600 outline-none transition hover:border-ink-400 focus-visible:border-brand-500"
                aria-haspopup="listbox"
                aria-expanded={dropOpen}
              >
                <Phone size={18} strokeWidth={1.5} className="shrink-0 text-ink-500" />
                <span className="flex-1 truncate">
                  {selectedDN ? `${selectedDN.label} (${selectedDN.number})` : 'Velg visningsnummer'}
                </span>
                <ChevronDown
                  size={20}
                  strokeWidth={1.5}
                  className={`shrink-0 text-ink-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {dropdownPortal}
            </div>

            {/* External only toggle */}
            <div className={`flex items-center gap-3 ${isMittNummer ? 'cursor-not-allowed opacity-40' : ''}`}>
              <button
                type="button"
                role="switch"
                aria-checked={extOnly}
                disabled={isMittNummer}
                onClick={() => !isMittNummer && setExtOnly((v) => !v)}
                className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  extOnly ? 'bg-brand-500' : 'bg-ink-400'
                }`}
              >
                <span
                  className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    extOnly ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-sm font-light text-ink-800 select-none">
                Bruk kun for externe samtaler
              </span>
            </div>
          </div>

          {/* Queues */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-base font-medium text-ink-600">Køer</label>
              <p className="text-sm font-light text-ink-600">
                Køer du ikke velger vil ikke påvirkes av tidsstyringen
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {queues.map((q) => {
                const edit = queueEdits[q.id] ?? { loggedIn: false, smsVarsling: false };
                return (
                  <div
                    key={q.id}
                    className="overflow-hidden rounded-lg bg-[#F9F9FB]"
                  >
                    {/* Queue header */}
                    <div className="px-3 py-3">
                      <p className="text-base font-medium text-ink-600">
                        {q.name} ({q.number})
                      </p>
                    </div>
                    {/* Divider */}
                    <div className="h-px bg-[#B2BAD1]" />
                    {/* Checkboxes — horizontal row */}
                    <div className="flex items-center gap-6 px-3 py-3">
                      {[
                        { field: 'loggedIn' as const,    label: 'Pålogget' },
                        { field: 'smsVarsling' as const, label: 'MBN SMS-varsling' },
                      ].map(({ field, label }) => (
                        <button
                          key={field}
                          type="button"
                          onClick={() => toggleQueue(q.id, field)}
                          className="flex items-center gap-2 text-left"
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] border-2 transition-colors ${
                              edit[field]
                                ? 'border-brand-500 bg-brand-500'
                                : 'border-ink-300 bg-surface'
                            }`}
                          >
                            {edit[field] && (
                              <Check size={14} strokeWidth={2.5} className="text-white" />
                            )}
                          </span>
                          <span className="text-base font-light text-ink-800">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-ink-200 px-8 py-4">
          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="flex h-12 items-center rounded-full px-6 text-lg font-medium text-[#C70505] transition hover:bg-red-50"
          >
            Slett tidsperiode
          </button>

          {/* Right: Cancel + Save */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 items-center rounded-full bg-brand-50 px-6 text-lg font-medium text-brand-500 transition hover:bg-brand-50/70"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex h-12 items-center rounded-full bg-brand-500 px-6 text-lg font-medium text-white transition hover:bg-brand-600"
            >
              Lagre
            </button>
          </div>
        </footer>

      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

// ─── Time input ───────────────────────────────────────────────────────────────

function TimeInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="relative flex items-center">
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-12 w-[142px] appearance-none rounded-lg border border-ink-200 bg-surface pl-4 pr-10 text-lg font-light text-ink-800 outline-none transition focus:border-brand-500 [&::-webkit-calendar-picker-indicator]:opacity-0"
      />
      <Clock size={18} strokeWidth={1.75} className="pointer-events-none absolute right-3 text-ink-500" />
    </div>
  );
}
