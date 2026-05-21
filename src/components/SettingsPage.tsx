import { useState } from 'react';
import { ChevronRight, Pencil, Trash2, Plus, Check } from 'lucide-react';
import { useJobProfile } from '../store/jobProfileStore';
import type { LoginMode, TimePeriod } from '../types/jobProfile';
import { EndreTidsperiodeDialog } from './EndreTidsperiodeDialog';
import { LeggTilTidsperiodeDialog } from './LeggTilTidsperiodeDialog';
import { SlettTidsperiodeDialog } from './SlettTidsperiodeDialog';

// Full day name → abbreviated badge label
const DAY_ABBREV: Record<string, string> = {
  Mandag: 'Man',
  Tirsdag: 'Tirs',
  Onsdag: 'Ons',
  Torsdag: 'Tors',
  Fredag: 'Fre',
  Lørdag: 'Lør',
  Søndag: 'Søn',
};

const WEEKDAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag'];

function getDayBadges(days: string[]): string[] {
  const allWeekdays = WEEKDAYS.every((d) => days.includes(d));
  if (allWeekdays) {
    const weekend = days.filter((d) => !WEEKDAYS.includes(d));
    return ['Alle hverdager', ...weekend];
  }
  return days;
}

const MENU_ITEMS = [
  'Tidsstyring',
  'Språk',
  'Viderekobling',
  'Mine numre',
  'Visningsnummer',
  'Hurtigtaster',
  'Meldingsmaler',
  'Illustrasjoner',
];

const LOGIN_OPTIONS: { value: LoginMode; label: string; desc: string }[] = [
  {
    value: 'automatisk',
    label: 'Automatisk',
    desc: 'Du logges på og av når tidsperioden starter og slutter',
  },
  {
    value: 'paminnelse',
    label: 'Påminnelse',
    desc: 'Du får en påminnelse 10 minutter før tidsperioden starter og slutter, og logger på og av selv.',
  },
];

interface Props {
  onBack: () => void;
}

export function SettingsPage({ onBack }: Props) {
  const timePeriods   = useJobProfile((s) => s.timePeriods);
  const displayNumbers = useJobProfile((s) => s.displayNumbers);
  const queues        = useJobProfile((s) => s.queues);
  const loginMode     = useJobProfile((s) => s.loginMode);
  const setLoginMode  = useJobProfile((s) => s.setLoginMode);
  const [reminderChecked, setReminderChecked] = useState(true);
  const [editingPeriod, setEditingPeriod] = useState<TimePeriod | null>(null);
  const [deletingPeriodId, setDeletingPeriodId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const hasPeriods = timePeriods.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-4">

      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm">
        <button
          type="button"
          onClick={onBack}
          className="font-light text-ink-500 transition hover:text-brand-500"
        >
          Mitt MBN
        </button>
        <ChevronRight size={14} strokeWidth={1.5} className="text-ink-400" />
        <span className="font-medium text-ink-800">Innstillinger</span>
      </nav>

      {/* Panel */}
      <div className="flex flex-1 overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[0_2px_8px_rgba(24,34,63,0.06)]">

        {/* Left menu */}
        <aside className="w-52 shrink-0 border-r border-ink-200 px-4 py-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
            Snarveier
          </p>
          <nav className="flex flex-col gap-0.5">
            {MENU_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded px-2 py-1.5 text-left text-sm font-light text-brand-500 transition hover:bg-brand-50"
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Form content */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <section className="flex max-w-[640px] flex-col gap-8">

            {/* Section header */}
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-medium text-ink-800">Tidsstyring</h2>
              <p className="text-sm font-light text-ink-600">
                Administrer timeperioder for visningsnummer, og hvilke køer du ønsker å være pålogget.
              </p>
            </div>

            {/* Tidsperioder */}
            <div className="flex flex-col gap-3">
              {hasPeriods && (
                <h3 className="text-base font-medium text-ink-800">Tidsperioder</h3>
              )}

              {hasPeriods ? (
                <>
                  {/* All period cards in one container, separated by dividers */}
                  <div className="overflow-hidden rounded-lg divide-y divide-ink-200">
                    {timePeriods.map((period) => {
                      const displayNum = displayNumbers.find((n) => n.id === period.displayNumberId);
                      const loggedInQueues = queues
                        .filter((q) => period.queueAssignments[q.id]?.loggedIn)
                        .map((q) => q.name)
                        .join(', ');
                      const smsQueues = queues
                        .filter((q) => period.queueAssignments[q.id]?.smsVarsling)
                        .map((q) => q.name)
                        .join(', ');

                      return (
                        <div key={period.id} className="flex flex-col gap-2 bg-[#F9F9FB] p-4">
                          {/* Row 1: time range + action buttons */}
                          <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-ink-800">
                              {period.timeFrom} - {period.timeTo}
                            </span>
                            <div className="flex gap-0.5">
                              <button
                                type="button"
                                aria-label="Rediger"
                                onClick={() => setEditingPeriod(period)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-brand-500 transition hover:bg-brand-50"
                              >
                                <Pencil size={18} strokeWidth={1.75} />
                              </button>
                              <button
                                type="button"
                                aria-label="Slett"
                                onClick={() => setDeletingPeriodId(period.id)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-brand-500 transition hover:bg-brand-50"
                              >
                                <Trash2 size={18} strokeWidth={1.75} />
                              </button>
                            </div>
                          </div>

                          {/* Row 2: day badges */}
                          <div className="flex flex-wrap gap-1.5">
                            {getDayBadges(period.days).map((day) => (
                              <span
                                key={day}
                                className="rounded-full bg-[#EBFFFF] px-3 py-1 text-sm font-medium text-[#0E0A7F]"
                              >
                                {DAY_ABBREV[day] ?? day}
                              </span>
                            ))}
                          </div>

                          {/* Row 3: key-value pairs */}
                          <div className="flex flex-col gap-1.5">
                            {[
                              {
                                key: 'Visningsnummer',
                                value: displayNum
                                  ? `${displayNum.label} (${displayNum.number})`
                                  : '—',
                              },
                              { key: 'Pålogget',         value: loggedInQueues || '—' },
                              { key: 'MBN SMS-varsling', value: smsQueues      || '—' },
                            ].map(({ key, value }) => (
                              <div key={key} className="flex gap-3 text-base">
                                <span className="w-40 shrink-0 font-light text-ink-500">{key}</span>
                                <span className="font-light text-ink-800">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add period button */}
                  <button
                    type="button"
                    onClick={() => setAddDialogOpen(true)}
                    className="flex w-fit items-center gap-2 rounded-full px-5 py-3 text-[18px] font-medium text-brand-500 transition hover:bg-brand-50"
                  >
                    <Plus size={16} strokeWidth={2} />
                    Legg til tidsperiode
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between rounded-lg bg-[#F9F9FB] px-4 py-4">
                  <p className="text-sm font-light text-ink-800">Ingen tidsstyring aktivert.</p>
                  <button
                    type="button"
                    onClick={() => setAddDialogOpen(true)}
                    className="rounded-full bg-brand-50 px-5 py-2 text-sm font-bold text-brand-500 transition hover:bg-brand-100"
                  >
                    Aktiver
                  </button>
                </div>
              )}
            </div>

            {/* Utenfor tidsperioder */}
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-medium text-ink-800">Utenfor tidsperioder</h3>
              <p className="text-sm font-light text-ink-600">
                Ved slutten av en tidsperiode logges du av de valgte køene, visningsnummer
                tilbakestilles til ditt eget nummer, og Jobbprofil slås av dersom du ikke lenger er
                logget på noen køer.
              </p>
            </div>

            <div className="h-px bg-ink-200" />

            {/* Innstillinger */}
            <div className="flex flex-col gap-6">
              <h3 className="text-base font-medium text-ink-800">Innstillinger</h3>

              {/* På- og avlogging */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-ink-800">På- og avlogging</p>
                  <p className="text-sm font-light text-ink-500">
                    På- og avlogging skjer i henhold til arbeidstiden du har satt
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {LOGIN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setLoginMode(opt.value)}
                      className="flex items-start gap-3 text-left"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          loginMode === opt.value ? 'border-brand-500' : 'border-ink-300'
                        }`}
                      >
                        {loginMode === opt.value && (
                          <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                        )}
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-ink-800">{opt.label}</span>
                        <span className="text-sm font-light text-ink-600">{opt.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Påminnelse om arbeidstid */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-ink-800">Påminnelse om arbeidstid</p>
                  <p className="text-sm font-light text-ink-500">
                    Du varsles 10 minutter før arbeidstiden starter og slutter
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReminderChecked((v) => !v)}
                  className="flex items-start gap-3 text-left"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors ${
                      reminderChecked
                        ? 'border-brand-500 bg-brand-500'
                        : 'border-ink-300 bg-surface'
                    }`}
                  >
                    {reminderChecked && (
                      <Check size={12} strokeWidth={2.5} className="text-white" />
                    )}
                  </span>
                  <span className="text-sm font-light text-ink-800">
                    Få en påminnelse 10 minutter før tidsperioden starter og slutter
                  </span>
                </button>
              </div>
            </div>

          </section>
        </main>
      </div>

      {/* Endre tidsperiode dialog */}
      {editingPeriod && (
        <EndreTidsperiodeDialog
          period={editingPeriod}
          onClose={() => setEditingPeriod(null)}
        />
      )}

      {/* Legg til tidsperiode dialog */}
      {addDialogOpen && (
        <LeggTilTidsperiodeDialog onClose={() => setAddDialogOpen(false)} />
      )}

      {/* Slett tidsperiode confirmation dialog */}
      {deletingPeriodId && (
        <SlettTidsperiodeDialog
          periodId={deletingPeriodId}
          onClose={() => setDeletingPeriodId(null)}
        />
      )}
    </div>
  );
}
