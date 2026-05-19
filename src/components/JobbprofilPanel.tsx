import { useState, useEffect, useRef } from 'react';
import { MoreVertical, X, Check, ChevronRight } from 'lucide-react';
import { useJobProfile } from '../store/jobProfileStore';
import { Toggle } from './Toggle';
import { DisplayNumberDropdown } from './DisplayNumberDropdown';
import { QueueTable } from './QueueTable';
import { TidsstyringDialog } from './TidsstyringDialog';
import type { TimePeriod } from '../types/jobProfile';

function getNextEventLabel(
  isActive: boolean,
  currentTimeTo: string,
  periods: TimePeriod[],
): string {
  if (isActive) {
    const backToBack = periods.some((p) => p.timeFrom === currentTimeTo);
    return backToBack ? `Ny periode ${currentTimeTo}` : `Logges av ${currentTimeTo}`;
  }
  const sorted = [...periods].sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));
  return sorted.length > 0 ? `Logger på ${sorted[0].timeFrom}` : '';
}

interface Props {
  onNavigateToSettings?: () => void;
}

export function JobbprofilPanel({ onNavigateToSettings }: Props) {
  const enabled = useJobProfile((s) => s.enabled);
  const setEnabled = useJobProfile((s) => s.setEnabled);

  const tidsstyringActive = useJobProfile((s) => s.tidsstyringActive);
  const setTidsstyringActive = useJobProfile((s) => s.setTidsstyringActive);
  const tidsstyringConfigured = useJobProfile((s) => s.tidsstyringConfigured);
  const tidsstyringTimeFrom = useJobProfile((s) => s.tidsstyringTimeFrom);
  const tidsstyringTimeTo = useJobProfile((s) => s.tidsstyringTimeTo);
  const timePeriods           = useJobProfile((s) => s.timePeriods);
  const finalizeWizardPeriod  = useJobProfile((s) => s.finalizeWizardPeriod);

  const nextEventLabel = getNextEventLabel(tidsstyringActive, tidsstyringTimeTo, timePeriods);

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
  }

  // Status dot + label in the header
  // "Tidsstyrt:" prefix only when tidsstyring is active (in-period).
  // When tidsstyring is configured but toggled off, falls back to manual Pålogget/Avlogget.
  const tidsstyrtActive = tidsstyringConfigured && tidsstyringActive;
  const statusLabel = tidsstyrtActive
    ? (enabled ? 'Tidsstyrt: Pålogget' : 'Tidsstyrt: Avlogget')
    : (enabled ? 'Pålogget' : 'Avlogget');
  const statusGreen = enabled;

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
          <h2 className="text-xl font-medium text-ink-600">Jobbprofil</h2>
          {/* Status dot + label */}
          <div className="ml-1 flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${statusGreen ? 'bg-[#178222]' : 'bg-ink-600'}`} />
            <span className="text-sm font-light text-ink-600">{statusLabel}</span>
          </div>
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
                onClick={() => setMenuOpen(false)}
                className="flex h-[49px] w-full items-center border-x border-[#7C88AB]/30 px-5 text-base font-light text-ink-800 transition hover:bg-surface-alt"
              >
                Anropsdistribusjon
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Activation notification */}
      {showNotification && tidsstyringActive && (
        <div className="mx-4 mt-4 flex items-center gap-2.5 rounded-[8px] bg-[#D8FDDC] px-4 py-3">
          {/* Green circle with checkmark */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#24A831]">
            <Check size={14} strokeWidth={3} className="text-white" />
          </div>
          {/* Message */}
          <p
            className="flex-1 text-base font-light leading-snug"
            style={{ color: 'rgb(17,69,22)' }}
          >
            Tidsstyring er aktivert og klar til bruk
          </p>
          {/* Dismiss */}
          <button
            type="button"
            onClick={() => setShowNotification(false)}
            aria-label="Lukk"
            className="shrink-0 transition hover:opacity-60"
            style={{ color: 'rgb(0,11,46)' }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
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
        <div className="flex flex-col gap-1.5 pl-6 pr-4 pt-3 pb-3">

          {/* Toggle row */}
          <div className="flex items-center gap-2">
            <span className="flex-1 text-base font-light text-ink-800">Tidsstyring</span>
            <Toggle
              on={tidsstyringActive}
              onChange={setTidsstyringActive}
              ariaLabel="Tidsstyring på/av"
              size="md"
            />
          </div>

          {/* Nå — only while inside an active period */}
          {tidsstyringActive && (
            <div className="flex items-baseline gap-2 text-sm font-light">
              <span className="w-14 shrink-0 text-ink-500">Nå:</span>
              <span className="text-ink-800">Logget på {tidsstyringTimeFrom}</span>
            </div>
          )}

          {/* Neste — only when tidsstyring toggle is on */}
          {tidsstyringActive && tidsstyringConfigured && nextEventLabel && (
            <div className="flex items-baseline gap-2 text-sm font-light">
              <span className="w-14 shrink-0 text-ink-500">Neste:</span>
              <span className="text-ink-800">{nextEventLabel}</span>
            </div>
          )}

          {/* State 2 & 3: Endre tidsstyring */}
          <button
            type="button"
            onClick={() => onNavigateToSettings?.()}
            className="mt-0.5 flex w-fit items-center gap-1 text-sm font-medium text-brand-500 transition hover:text-brand-600"
          >
            Endre tidsstyring
            <ChevronRight size={13} strokeWidth={2} />
          </button>

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
