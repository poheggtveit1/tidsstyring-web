import { useEffect, useRef, useState } from 'react';
import {
  X, Clock, Sparkles, Users, Bell, ArrowRight, Check, ChevronLeft,
  ChevronDown, Phone,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useJobProfile } from '../store/jobProfileStore';
import { Toggle } from './Toggle';
import type { Queue } from '../types/jobProfile';

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardStep = 'info' | 'tidsperiode' | 'visningsnummer' | 'koer' | 'paa-og-avlogging';
type LoginMode = 'automatisk' | 'paminnelse';

interface QueueWizardState {
  loggedIn: boolean;
  smsVarsling: boolean;
}

interface Props {
  onClose: () => void;
  onFinish: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INFO_FEATURES = [
  {
    icon: Clock,
    title: 'Tidsperioder',
    description: 'Velg dager og tidspunkt. Du kan sette opp så mange perioder du trenger.',
  },
  {
    icon: Sparkles,
    title: 'På og av til rett tid',
    description:
      'Jobbprofil slås på ved starten av en periode og av ved slutten av en periode dersom man ikke lenger er pålogget noen køer.',
  },
  {
    icon: Users,
    title: 'Du styrer køene',
    description:
      'Du velger selv hvilke køer du vil være pålogget i hver tidsperiode. Køer du ikke velger påvirkes ikke av tidsstyringen.',
  },
  {
    icon: Bell,
    title: 'Påminnelse 10 minutter før',
    description:
      'Du får en påminnelse 10 minutter før hver periode starter og slutter. Du kan slå av påminnelsen under Innstillinger.',
  },
];

const WIZARD_STEPS = [
  '1. Tidsperiode',
  '2. Visningsnummer',
  '3. Køer',
  '4. På- og avlogging',
];

const DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

// ─── Main component ───────────────────────────────────────────────────────────

export function TidsstyringDialog({ onClose, onFinish }: Props) {
  const [step, setStep] = useState<WizardStep>('info');
  const [hasStarted, setHasStarted] = useState(false);

  // Step 1: Tidsperiode
  const [timeFrom, setTimeFrom] = useState('08:00');
  const [timeTo, setTimeTo] = useState('16:00');
  const [selectedDays, setSelectedDays] = useState<Set<string>>(
    new Set(['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag']),
  );

  // Step 2: Visningsnummer — local wizard copies, applied to store on finish
  const displayNumbers = useJobProfile((s) => s.displayNumbers);
  const storeQueues = useJobProfile((s) => s.queues);
  const storeDisplayId = useJobProfile((s) => s.selectedDisplayNumberId);
  const setSelectedDisplayNumber = useJobProfile((s) => s.setSelectedDisplayNumber);
  const setExternalOnly = useJobProfile((s) => s.setExternalOnly);
  const setTidsstyringTimeRange = useJobProfile((s) => s.setTidsstyringTimeRange);
  const setTidsstyringDays = useJobProfile((s) => s.setTidsstyringDays);
  const setStoredLoginMode = useJobProfile((s) => s.setLoginMode);
  const setQueuesActive = useJobProfile((s) => s.setQueuesActive);
  const setTidsstyringActive = useJobProfile((s) => s.setTidsstyringActive);
  const [wizardDisplayId, setWizardDisplayId] = useState(storeDisplayId ?? 'mitt-nummer');
  const [wizardExternalOnly, setWizardExternalOnly] = useState(storeDisplayId !== 'mitt-nummer');

  // Step 4: På- og avlogging
  const [loginMode, setLoginMode] = useState<LoginMode>('automatisk');

  // Step 3: Køer
  const [wizardQueues, setWizardQueues] = useState<Record<string, QueueWizardState>>(
    () => Object.fromEntries(storeQueues.map((q) => [q.id, { loggedIn: false, smsVarsling: false }])),
  );

  function toggleWizardQueue(queueId: string, field: 'loggedIn' | 'smsVarsling') {
    setWizardQueues((prev) => {
      const current = prev[queueId];
      const next = { ...current, [field]: !current[field] };
      // Checking Pålogget also checks MBN SMS-varsling; unchecking it also unchecks it
      if (field === 'loggedIn') next.smsVarsling = next.loggedIn;
      return { ...prev, [queueId]: next };
    });
  }

  // Keep external-only in sync when display number changes inside wizard
  function handleWizardDisplayChange(id: string) {
    setWizardDisplayId(id);
    setWizardExternalOnly(id !== 'mitt-nummer');
  }

  function goBack() {
    if (step === 'paa-og-avlogging') return setStep('koer');
    if (step === 'koer') return setStep('visningsnummer');
    if (step === 'visningsnummer') return setStep('tidsperiode');
    setStep('info');
  }

  function handleFinish() {
    setSelectedDisplayNumber(wizardDisplayId);
    if (wizardDisplayId !== 'mitt-nummer') setExternalOnly(wizardExternalOnly);
    const activeStates = Object.fromEntries(
      Object.entries(wizardQueues).map(([id, qs]) => [id, qs.loggedIn]),
    );
    setQueuesActive(activeStates);
    const queueCount = Object.values(wizardQueues).filter((q) => q.loggedIn).length;
    setTidsstyringTimeRange(timeFrom, timeTo, queueCount);
    setTidsstyringDays(Array.from(selectedDays));
    setStoredLoginMode(loginMode);
    setTidsstyringActive(true);
    onFinish();
  }

  // Keyboard & scroll lock
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

  const dialog = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tidsstyring-title"
    >
      <div className="flex h-[720px] max-h-[90vh] w-full max-w-[800px] flex-col overflow-hidden rounded-[16px] bg-surface shadow-xl">

        {/* ── Shared header ── */}
        <header className="flex items-center justify-between border-b border-ink-200 px-8 py-4">
          <h2 id="tidsstyring-title" className="text-xl font-medium text-ink-600">
            Aktiver tidsstyring
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

        {/* ── Step content ── */}
        {step === 'info' && <InfoStep />}
        {step === 'tidsperiode' && (
          <TimePeriodStep
            timeFrom={timeFrom}
            timeTo={timeTo}
            selectedDays={selectedDays}
            onTimeFromChange={setTimeFrom}
            onTimeToChange={setTimeTo}
            onToggleDay={toggleDay}
          />
        )}
        {step === 'visningsnummer' && (
          <VisningsnummerStep
            displayNumbers={displayNumbers}
            selectedId={wizardDisplayId}
            externalOnly={wizardExternalOnly}
            onSelectId={handleWizardDisplayChange}
            onExternalOnlyChange={setWizardExternalOnly}
          />
        )}
        {step === 'koer' && (
          <KoerStep
            queues={storeQueues}
            wizardQueues={wizardQueues}
            onToggle={toggleWizardQueue}
          />
        )}
        {step === 'paa-og-avlogging' && (
          <PaaOgAvloggingStep
            loginMode={loginMode}
            onLoginModeChange={setLoginMode}
          />
        )}

        {/* ── Shared footer ── */}
        <footer className="flex items-center justify-between border-t border-ink-200 px-8 py-4">
          {/* Left button: Avbryt on info, Tilbake on subsequent steps */}
          {step === 'info' ? (
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 items-center rounded-full bg-brand-50 px-6 text-lg font-medium text-brand-500 transition hover:bg-brand-50/70"
            >
              Avbryt
            </button>
          ) : (
            <button
              type="button"
              onClick={goBack}
              className="flex h-12 items-center gap-1 rounded-full bg-brand-50 px-5 text-lg font-medium text-brand-500 transition hover:bg-brand-50/70"
            >
              <ChevronLeft size={20} strokeWidth={2} />
              Tilbake
            </button>
          )}

          {/* Right button */}
          {step === 'info' && (
            <button
              type="button"
              onClick={() => { setHasStarted(true); setStep('tidsperiode'); }}
              className="flex h-12 items-center gap-2 rounded-full bg-brand-500 px-6 text-lg font-medium text-white transition hover:bg-brand-600"
            >
              {hasStarted ? 'Fortsett' : 'Kom i gang'}
              <ArrowRight size={20} strokeWidth={2} />
            </button>
          )}
          {step === 'tidsperiode' && (
            <button
              type="button"
              onClick={() => setStep('visningsnummer')}
              className="flex h-12 items-center gap-2 rounded-full bg-brand-500 px-6 text-lg font-medium text-white transition hover:bg-brand-600"
            >
              Fortsett
              <ArrowRight size={20} strokeWidth={2} />
            </button>
          )}
          {step === 'visningsnummer' && (
            <button
              type="button"
              onClick={() => setStep('koer')}
              className="flex h-12 items-center gap-2 rounded-full bg-brand-500 px-6 text-lg font-medium text-white transition hover:bg-brand-600"
            >
              Fortsett
              <ArrowRight size={20} strokeWidth={2} />
            </button>
          )}
          {step === 'koer' && (
            <button
              type="button"
              onClick={() => setStep('paa-og-avlogging')}
              className="flex h-12 items-center gap-2 rounded-full bg-brand-500 px-6 text-lg font-medium text-white transition hover:bg-brand-600"
            >
              Fortsett
              <ArrowRight size={20} strokeWidth={2} />
            </button>
          )}
          {step === 'paa-og-avlogging' && (
            <button
              type="button"
              onClick={handleFinish}
              className="flex h-12 items-center rounded-full bg-brand-500 px-6 text-lg font-medium text-white transition hover:bg-brand-600"
            >
              Aktiver tidsstyring
            </button>
          )}
        </footer>

      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

// ─── Step 1: Info ─────────────────────────────────────────────────────────────

function InfoStep() {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8">
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-medium text-ink-600">Tidsstyr jobbprofilen din</p>
        <p className="text-base font-light text-ink-600">
          Sett opp når du skal være tilgjengelig, så logger tidsstyringen deg på og av
          valgte køer og viser alternativt visningsnummer.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {INFO_FEATURES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-5">
            <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-brand-50">
              <Icon size={22} strokeWidth={1.75} className="text-brand-500" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-ink-600">{title}</p>
              <p className="text-base font-light text-ink-800">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared progress bar ─────────────────────────────────────────────────────

function StepProgressBar({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex gap-2">
      {WIZARD_STEPS.map((label, i) => {
        const filled = i <= activeIndex;
        return (
          <div key={label} className="flex flex-1 flex-col gap-2">
            <span className={`text-base font-medium ${filled ? 'text-ink-800' : 'text-ink-400'}`}>
              {label}
            </span>
            <div className={`h-1 rounded-full ${filled ? 'bg-brand-500' : 'bg-ink-200'}`} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 2: Tidsperiode ──────────────────────────────────────────────────────

interface TimePeriodProps {
  timeFrom: string;
  timeTo: string;
  selectedDays: Set<string>;
  onTimeFromChange: (v: string) => void;
  onTimeToChange: (v: string) => void;
  onToggleDay: (d: string) => void;
}

function TimePeriodStep({
  timeFrom, timeTo, selectedDays, onTimeFromChange, onTimeToChange, onToggleDay,
}: TimePeriodProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8">

      {/* Step progress bar */}
      <StepProgressBar activeIndex={0} />

      {/* Section heading */}
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-medium text-ink-600">Sett opp første tidsperiode</p>
        <p className="text-base font-light text-ink-600">
          Du kan legge til flere tidsperioder under Innstillinger etter aktivering.
        </p>
      </div>

      {/* Time range */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-medium text-ink-600">
          Velg tidspunkt (fra - til)
        </label>
        <div className="flex items-center gap-3">
          <TimeInput value={timeFrom} onChange={onTimeFromChange} ariaLabel="Fra" />
          <span className="text-base font-light text-ink-400">–</span>
          <TimeInput value={timeTo} onChange={onTimeToChange} ariaLabel="Til" />
        </div>
      </div>

      {/* Day picker */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-medium text-ink-600">Velg dager</label>
        <div className="flex gap-1.5">
          {DAYS.map((day) => {
            const on = selectedDays.has(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => onToggleDay(day)}
                className={`flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium transition ${
                  on
                    ? 'bg-ink-900 text-white'
                    : 'bg-ink-200 text-ink-600 hover:bg-ink-300'
                }`}
              >
                {day}
                {on && <Check size={14} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ─── Step 3: Visningsnummer ───────────────────────────────────────────────────

interface DisplayNumber {
  id: string;
  label: string;
  number: string;
}

interface VisningsnummerProps {
  displayNumbers: DisplayNumber[];
  selectedId: string;
  externalOnly: boolean;
  onSelectId: (id: string) => void;
  onExternalOnlyChange: (v: boolean) => void;
}

function VisningsnummerStep({
  displayNumbers, selectedId, externalOnly, onSelectId, onExternalOnlyChange,
}: VisningsnummerProps) {
  const isMittNummer = selectedId === 'mitt-nummer';
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = displayNumbers.find((n) => n.id === selectedId);

  function openDropdown() {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: r.bottom + 4,
        left: r.left,
        width: r.width,
        zIndex: 200,
      });
    }
    setOpen(true);
  }

  // Close on outside click (portal is in body, so check against trigger + list)
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const inTrigger = triggerRef.current?.contains(e.target as Node);
      const inList = listRef.current?.contains(e.target as Node);
      if (!inTrigger && !inList) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const dropdownPortal = open
    ? createPortal(
        <ul
          ref={listRef}
          role="listbox"
          style={dropdownStyle}
          className="max-h-64 overflow-auto rounded-[var(--radius-field)] border border-ink-200 bg-surface py-2 shadow-lg"
        >
          {displayNumbers.map((n) => {
            const active = n.id === selectedId;
            return (
              <li key={n.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => { onSelectId(n.id); setOpen(false); }}
                  className="flex w-full items-center gap-3 px-6 py-3 text-left text-[16px] font-light text-ink-800 hover:bg-surface-alt"
                >
                  <Phone size={18} className="shrink-0 text-ink-500" strokeWidth={1.5} />
                  <span className="flex-1 truncate">
                    {n.label} <span className="text-ink-500">({n.number})</span>
                  </span>
                  {active && <Check size={18} className="text-brand-500" strokeWidth={2} />}
                </button>
              </li>
            );
          })}
        </ul>,
        document.body,
      )
    : null;

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8">

      {/* Step progress bar */}
      <StepProgressBar activeIndex={1} />

      {/* Section heading */}
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-medium text-ink-600">Hvilket visningsnummer skal brukes?</p>
        <p className="text-base font-light text-ink-600">
          Nummeret vises til de du ringer i tidsperioden.
        </p>
      </div>

      {/* Display number dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium text-ink-600">
          Visningsnummer
        </label>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => open ? setOpen(false) : openDropdown()}
          className="flex h-12 w-full items-center gap-2 rounded-[var(--radius-field)] border border-ink-200 bg-surface px-4 text-left text-[18px] font-light text-ink-600 outline-none transition hover:border-ink-400 focus-visible:border-brand-500"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <Phone size={18} className="shrink-0 text-ink-500" strokeWidth={1.5} />
          <span className="flex-1 truncate">
            {selected ? `${selected.label} (${selected.number})` : 'Velg visningsnummer'}
          </span>
          <ChevronDown
            size={20}
            className={`shrink-0 text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`}
            strokeWidth={1.5}
          />
        </button>
        {dropdownPortal}
      </div>

      {/* External only toggle — hidden when Mitt nummer is selected */}
      {!isMittNummer && (
        <div className="flex items-center gap-3">
          <Toggle
            on={externalOnly}
            onChange={onExternalOnlyChange}
            ariaLabel="Bruk kun for eksterne samtaler"
          />
          <span className="text-sm font-light text-ink-800 select-none">
            Bruk kun for eksterne samtaler
          </span>
        </div>
      )}



    </div>
  );
}

// ─── Step 4: Køer ────────────────────────────────────────────────────────────

interface KoerProps {
  queues: Queue[];
  wizardQueues: Record<string, QueueWizardState>;
  onToggle: (queueId: string, field: 'loggedIn' | 'smsVarsling') => void;
}

function KoerStep({ queues, wizardQueues, onToggle }: KoerProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8">

      {/* Step progress bar */}
      <StepProgressBar activeIndex={2} />

      {/* Section heading */}
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-ink-600">
          Hva skal skje med køene når arbeidstiden starter?
        </p>
        <p className="text-base font-light text-ink-600">
          Køer som ikke velges påvirkes ikke av tidsstyringen.
        </p>
      </div>

      {/* Queue options — scrollable within the step */}
      <div className="flex flex-col gap-3">
          {queues.map((q) => {
            const ws = wizardQueues[q.id] ?? { loggedIn: false, smsVarsling: false };
            return (
              <div
                key={q.id}
                className="flex flex-col overflow-hidden rounded-[var(--radius-field)] bg-surface-alt"
              >
                {/* Queue name + number */}
                <div className="px-4 pt-3 pb-2">
                  <p className="text-base font-medium text-ink-600">
                    {q.name} ({q.number})
                  </p>
                </div>
                {/* Divider */}
                <div className="mx-4 h-px bg-ink-200" />
                {/* Checkboxes — horizontal row */}
                <div className="flex items-center gap-6 px-4 py-3">
                  <CheckboxRow
                    checked={ws.loggedIn}
                    label="Pålogget"
                    onChange={() => onToggle(q.id, 'loggedIn')}
                  />
                  <CheckboxRow
                    checked={ws.smsVarsling}
                    label="MBN SMS-varsling"
                    onChange={() => onToggle(q.id, 'smsVarsling')}
                  />
                </div>
              </div>
            );
          })}
        </div>

      {/* End-of-period info */}
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-ink-600">
          Ved slutten av tidsperioden
        </p>
        <p className="text-base font-light text-ink-600">
          Du logges av de valgte køene, MBN SMS-varsling slås av og visningsnummer tilbakestilles til ditt nummer.
        </p>
      </div>

    </div>
  );
}

function CheckboxRow({
  checked, label, onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex h-10 items-center gap-2 text-left"
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] border-2 transition-colors ${
          checked ? 'border-brand-500 bg-brand-500' : 'border-ink-300 bg-surface'
        }`}
      >
        {checked && <Check size={14} strokeWidth={2.5} className="text-white" />}
      </span>
      <span className="text-base font-light text-ink-800">{label}</span>
    </button>
  );
}

// ─── Step 5: På- og avlogging ─────────────────────────────────────────────────

const LOGIN_OPTIONS: { value: LoginMode; label: string; description: string }[] = [
  {
    value: 'automatisk',
    label: 'Automatisk',
    description: 'Du logges på og av når tidsperioden starter og slutter. Du får en påminnelse 10 minutter før.',
  },
  {
    value: 'paminnelse',
    label: 'Påminnelse',
    description: 'Du får en påminnelse 10 minutter før tidsperioden starter og slutter, og logger på og av selv.',
  },
];

function PaaOgAvloggingStep({
  loginMode,
  onLoginModeChange,
}: {
  loginMode: LoginMode;
  onLoginModeChange: (v: LoginMode) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8">

      {/* Step progress bar */}
      <StepProgressBar activeIndex={3} />

      {/* Section heading */}
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-ink-600">
          Vil du logges på og av automatisk, eller få påminnelse og gjøre det selv?
        </p>
        <p className="text-base font-light text-ink-600">
          Innstillingen gjelder hver gang en tidsperiode starter og slutter
        </p>
      </div>

      {/* Radio options */}
      <div className="flex flex-col gap-4">
        {LOGIN_OPTIONS.map((opt) => {
          const selected = loginMode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onLoginModeChange(opt.value)}
              className="flex items-start gap-4 text-left"
            >
              {/* Radio ring */}
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                selected ? 'border-brand-500' : 'border-ink-300'
              }`}>
                {selected && <span className="h-3 w-3 rounded-full bg-brand-500" />}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-medium text-ink-800">{opt.label}</span>
                <span className="text-base font-light text-ink-600">{opt.description}</span>
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
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
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative flex items-center">
      <input
        ref={inputRef}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-12 w-[152px] appearance-none rounded-[4px] border border-ink-200 bg-surface pl-4 pr-10 text-lg font-light text-ink-800 outline-none transition focus:border-brand-500 [&::-webkit-calendar-picker-indicator]:opacity-0"
      />
      <Clock
        size={18}
        strokeWidth={1.75}
        className="absolute right-3 cursor-pointer text-ink-400"
        onClick={() => inputRef.current?.showPicker()}
      />
    </div>
  );
}
