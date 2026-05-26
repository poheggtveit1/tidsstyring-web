import type { TimePeriod } from '../types/jobProfile';

const NORWEGIAN_DAYS = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

function getNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function findNextPeriodAcrossDays(
  periods: TimePeriod[],
  todayIdx: number,
  afterTime: string,
): { dayOffset: number; timeFrom: string } | null {
  for (let offset = 0; offset <= 6; offset++) {
    const dayIdx = (todayIdx + offset) % 7;
    const dayName = NORWEGIAN_DAYS[dayIdx];
    const dayPeriods = periods
      .filter((p) => p.days.includes(dayName))
      .sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));
    const candidate = offset === 0
      ? dayPeriods.find((p) => p.timeFrom > afterTime)
      : dayPeriods[0];
    if (candidate) return { dayOffset: offset, timeFrom: candidate.timeFrom };
  }
  return null;
}

/**
 * Returns the next TimePeriod if it starts within 30 minutes from now (same day only).
 * Returns null if we're currently inside a period, or the next period is ≥ 30 min away.
 */
export function getUpcomingPeriod(periods: TimePeriod[]): TimePeriod | null {
  if (periods.length === 0) return null;

  const now = getNow();
  const today = NORWEGIAN_DAYS[new Date().getDay()];

  const todayPeriods = periods
    .filter((p) => p.days.includes(today))
    .sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));

  // Currently inside a period → no "upcoming" to show
  if (todayPeriods.some((p) => now >= p.timeFrom && now < p.timeTo)) return null;

  const next = todayPeriods.find((p) => p.timeFrom > now);
  if (!next) return null;

  const [nh, nm] = now.split(':').map(Number);
  const [th, tm] = next.timeFrom.split(':').map(Number);
  const minsUntil = th * 60 + tm - (nh * 60 + nm);

  return minsUntil < 60 ? next : null;
}

export interface TidsstyringStatus {
  inPeriod: boolean;
  prevLabel: string;
  nextLabel: string;
}

export function computeTidsstyringStatus(
  periods: TimePeriod[],
  isActive: boolean,
  activeQueueIds?: string[],
): TidsstyringStatus {
  if (!isActive || periods.length === 0) {
    return { inPeriod: false, prevLabel: '', nextLabel: '' };
  }

  const now = getNow();
  const todayIdx = new Date().getDay();
  const today = NORWEGIAN_DAYS[todayIdx];

  const todayPeriods = periods
    .filter((p) => p.days.includes(today))
    .sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));

  if (todayPeriods.length === 0) {
    return { inPeriod: false, prevLabel: '', nextLabel: '' };
  }

  const active = todayPeriods.find((p) => now >= p.timeFrom && now < p.timeTo);
  if (active) {
    const backToBack = todayPeriods.some((p) => p.timeFrom === active.timeTo);
    return {
      inPeriod: true,
      prevLabel: `Pålogget ${active.timeFrom}`,
      nextLabel: backToBack ? `Ny periode ${active.timeTo}` : `Logges av ${active.timeTo}`,
    };
  }

  const prev = [...todayPeriods].reverse().find((p) => p.timeTo <= now);
  const nextSameDay = todayPeriods.find((p) => p.timeFrom > now);

  let nextLabel = '';
  if (nextSameDay) {
    // If the caller supplies current active queue IDs and they already match
    // the next period's queues exactly, period start causes no change —
    // show the end of that period as the next actual event instead.
    const alreadyLoggedIn = activeQueueIds !== undefined && (() => {
      const periodIds = Object.entries(nextSameDay.queueAssignments)
        .filter(([, qs]) => qs.loggedIn)
        .map(([id]) => id)
        .sort();
      const currentIds = [...activeQueueIds].sort();
      return (
        periodIds.length === currentIds.length &&
        periodIds.every((id, i) => id === currentIds[i])
      );
    })();

    nextLabel = alreadyLoggedIn
      ? `Logges av ${nextSameDay.timeTo}`
      : `Logges på ${nextSameDay.timeFrom}`;
  } else {
    const found = findNextPeriodAcrossDays(periods, todayIdx, now);
    if (found && found.dayOffset > 0) {
      const dayName = found.dayOffset === 1
        ? 'i morgen'
        : NORWEGIAN_DAYS[(todayIdx + found.dayOffset) % 7].toLowerCase();
      nextLabel = `Logges på ${dayName} ${found.timeFrom}`;
    }
  }

  return {
    inPeriod: false,
    prevLabel: prev ? `Avlogget ${prev.timeTo}` : '',
    nextLabel,
  };
}
