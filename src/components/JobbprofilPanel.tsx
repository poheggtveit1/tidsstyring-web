import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Clock } from 'lucide-react';
import { Toast } from './Toast';
import { useJobProfile } from '../store/jobProfileStore';
import { Toggle } from './Toggle';
import { DisplayNumberDropdown } from './DisplayNumberDropdown';
import { QueueTable } from './QueueTable';
import { TidsstyringDialog } from './TidsstyringDialog';
import { computeTidsstyringStatus, getUpcomingPeriod } from '../utils/tidsstyringStatus';

interface Props {
  onNavigateToSettings?: () => void;
}

export function JobbprofilPanel({ onNavigateToSettings }: Props) {
  const enabled = useJobProfile((s) => s.enabled);
  const setEnabled = useJobProfile((s) => s.setEnabled);

  const tidsstyringActive = useJobProfile((s) => s.tidsstyringActive);
  const setTidsstyringActive = useJobProfile((s) => s.setTidsstyringActive);
  const tidsstyringConfigured = useJobProfile((s) => s.tidsstyringConfigured);
  const timePeriods           = useJobProfile((s) => s.timePeriods);
  const finalizeWizardPeriod  = useJobProfile((s) => s.finalizeWizardPeriod);
  const setQueuesActive          = useJobProfile((s) => s.setQueuesActive);
  const lastSessionQueueIds      = useJobProfile((s) => s.lastSessionQueueIds);
  const queues                   = useJobProfile((s) => s.queues);
  const setSelectedDisplayNumber = useJobProfile((s) => s.setSelectedDisplayNumber);

  // Recompute status every 30 s so the display stays in sync with the clock
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const activeQueueIds = queues.filter((q) => q.active).map((q) => q.id);
  const { prevLabel, nextLabel } = computeTidsstyringStatus(timePeriods, tidsstyringActive, activeQueueIds);

  const externalOnly = useJobProfile((s) => s.externalOnly);
  const setExternalOnly = useJobProfile((s) => s.setExternalOnly);
  const selectedDisplayNumberId = useJobProfile((s) => s.selectedDisplayNumberId);
  const externalOnlyDisabled = selectedDisplayNumberId === 'mitt-nummer' || !enabled;

  const [wizardOpen, setWizardOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setMenuOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!showNotification) return;
    const t = setTimeout(() => setShowNotification(false), 5000);
    return () => clearTimeout(t);
  }, [showNotification]);

  function handleEnabledChange(v: boolean) {
    setEnabled(v);
    if (v && tidsstyringConfigured) {
      const upcoming = getUpcomingPeriod(timePeriods);
      if (upcoming) {
        // < 60 min to next period — apply upcoming period queues + display number
        setQueuesActive(
          Object.fromEntries(
            Object.entries(upcoming.queueAssignments).map(([id, qs]) => [id, qs.loggedIn])
          )
        );
        setSelectedDisplayNumber(upcoming.displayNumberId);
      } else if (lastSessionQueueIds.length > 0) {
        // ≥ 60 min — restore last session queues
        const states = Object.fromEntries(queues.map((q) => [q.id, lastSessionQueueIds.includes(q.id)]));
        setQueuesActive(states);
      }
    }
  }


  return (
    <section
      aria-label="Jobbprofil"
      className="flex flex-1 flex-col w-full overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[0_2px_8px_rgba(24,34,63,0.06)]"
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-ink-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <Toggle
            on={enabled}
            onChange={handleEnabledChange}
            ariaLabel="Aktiver jobbprofil"
            size="md"
          />
          <h2 className="text-xl font-medium text-ink-600">På jobb</h2>
        </div>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="Flere valg"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-1 text-brand-500 transition hover:bg-brand-50"
          >
            <MoreVertical size={18} strokeWidth={2} />
          </button>

          {/* Context menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-[293px] overflow-hidden rounded-[8px] bg-white shadow-[0_2px_8px_rgba(0,26,102,0.10),0_4px_16px_rgba(0,26,102,0.05),0_1px_3px_rgba(0,26,102,0.02)]">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  if (tidsstyringConfigured) {
                    onNavigateToSettings?.();
                  } else {
                    setWizardOpen(true);
                  }
                }}
                className="flex h-[49px] w-full items-center gap-2 border-x border-[#7C88AB]/30 px-5 text-base font-light text-ink-800 transition hover:bg-surface-alt"
              >
                <Clock size={16} strokeWidth={1.5} className="text-ink-500" />
                Tidsstyring
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Activation toast */}
      {showNotification && tidsstyringActive && (
        <Toast
          message="Tidsstyring er aktivert og klar til bruk"
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Tidsstyring — three states */}
      {!tidsstyringConfigured ? (

        /* ── State 1: never activated — single row with Aktiver button ── */
        <div className="flex items-center gap-1.5 pl-6 pr-4 py-3">
          <span className="flex-1 text-base font-light text-ink-800">Tidsstyring</span>
          <button
            type="button"
            onClick={() => setWizardOpen(true)}
            className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-brand-50 px-3 text-sm font-medium text-brand-500 transition hover:bg-brand-100"
          >
            Aktiver
          </button>
        </div>

      ) : (

        /* ── State 2 & 3: configured — toggle + optional Nå/Neste ── */
        <div className="flex flex-col gap-1.5 pl-14 pr-4 pt-3 pb-3">

          {/* Label row */}
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm font-medium text-ink-800">Tidsstyring</span>
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${tidsstyringActive ? 'bg-[#178222]' : 'bg-ink-400'}`} />
              <span className="text-sm font-light text-ink-600">{tidsstyringActive ? 'På' : 'Av'}</span>
            </div>
          </div>

          {/* Gjeldende endring */}
          {tidsstyringActive && prevLabel && (
            <div className="flex items-baseline text-sm font-light">
              <span className="shrink-0 text-ink-500">Gjeldende:</span>
              <span className="flex-1 text-right text-ink-800">{prevLabel}</span>
            </div>
          )}

          {/* Neste endring */}
          {tidsstyringActive && nextLabel && (
            <div className="flex items-baseline text-sm font-light">
              <span className="shrink-0 text-ink-500">Neste:</span>
              <span className="flex-1 text-right text-ink-800">{nextLabel}</span>
            </div>
          )}

        </div>
      )}

      {/* Visningsnummer */}
      <div className="px-4 pt-2 pb-2">
        <DisplayNumberDropdown />
      </div>

      {/* External only toggle — hidden when Mitt nummer is selected */}
      {!externalOnlyDisabled && (
        <div className="flex items-center gap-3 px-4 pb-2 pt-1">
          <Toggle
            on={externalOnly}
            onChange={setExternalOnly}
            ariaLabel="Bruk kun for eksterne samtaler"
            size="md"
          />
          <span className="text-sm font-light text-ink-800 select-none">
            Bruk kun for eksterne samtaler
          </span>
        </div>
      )}

      {/* Queue table */}
      <QueueTable />

      {/* Tidsstyring wizard */}
      {wizardOpen && (
        <TidsstyringDialog
          onClose={() => setWizardOpen(false)}
          onFinish={() => {
            finalizeWizardPeriod();
            setWizardOpen(false);
            setEnabled(true);
            setTidsstyringActive(true);
            setShowNotification(true);
          }}
        />
      )}
    </section>
  );
}
