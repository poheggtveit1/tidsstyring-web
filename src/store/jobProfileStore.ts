import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JobProfileState, LoginMode, TimePeriod } from '../types/jobProfile';

interface Actions {
  setEnabled: (v: boolean) => void;
  setTidsstyringActive: (v: boolean) => void;
  setTidsstyringTimeRange: (from: string, to: string, queueCount: number) => void;
  setTidsstyringDays: (days: string[]) => void;
  setLoginMode: (mode: LoginMode) => void;
  deleteTidsstyring: () => void;
  setSelectedDisplayNumber: (id: string) => void;
  setExternalOnly: (v: boolean) => void;
  toggleQueueActive: (queueId: string) => void;
  setQueuesActive: (states: Record<string, boolean>) => void;
  reset: () => void;
  // Multi-period actions
  addTimePeriod: (period: Omit<TimePeriod, 'id'>) => void;
  updateTimePeriod: (id: string, data: Omit<TimePeriod, 'id'>) => void;
  deleteTimePeriod: (id: string) => void;
  finalizeWizardPeriod: () => void;
}

const initialState: JobProfileState = {
  enabled: false,
  tidsstyringActive: false,
  tidsstyringConfigured: false,
  tidsstyringStatus: '· logger av 16:00 · logger på tirsdag 08:00',
  tidsstyringTimeFrom: '08:00',
  tidsstyringTimeTo: '16:00',
  tidsstyringQueueCount: 0,
  tidsstyringDays: ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag'],
  loginMode: 'automatisk' as LoginMode,
  displayNumbers: [
    { id: 'mitt-nummer', label: 'Mitt nummer', number: '99 00 88 00' },
    { id: 'support', label: 'Support', number: '22 33 44 55' },
    { id: 'sentralbord', label: 'Sentralbord', number: '22 00 00 00' },
    { id: 'salg', label: 'Salg', number: '22 11 22 33' },
    { id: 'resepsjon', label: 'Resepsjon', number: '22 99 88 77' },
  ],
  selectedDisplayNumberId: 'mitt-nummer',
  externalOnly: false,
  queues: [
    { id: 'kundeservice', name: 'Administrasjon', number: '23 00 11 22', active: false, inQueue: 4,    waitTime: '24:38',  operatorsActive: 1, operatorsTotal: 1 },
    { id: 'salg',         name: 'Support',        number: '23 00 33 44', active: false, inQueue: 5,    waitTime: '5:03',   operatorsActive: 2, operatorsTotal: 3 },
    { id: 'resepsjon',    name: 'Verksted',        number: '23 00 99 00', active: false, inQueue: 4,    waitTime: '19:04',  operatorsActive: 1, operatorsTotal: 1 },
  ],
  timePeriods: [],
  lastActiveQueueIds: [],
};

export const useJobProfile = create<JobProfileState & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setEnabled: (v) =>
        set((s) => {
          if (!v) {
            // Switching OFF — remember active queues, then deactivate all
            const lastActiveQueueIds = s.queues.filter((q) => q.active).map((q) => q.id);
            return {
              enabled: false,
              lastActiveQueueIds,
              queues: s.queues.map((q) =>
                q.active
                  ? { ...q, active: false, operatorsActive: Math.max(q.operatorsActive - 1, 0) }
                  : q,
              ),
            };
          } else {
            // Switching ON — restore previously active queues
            const ids = new Set(s.lastActiveQueueIds);
            return {
              enabled: true,
              queues: s.queues.map((q) =>
                ids.has(q.id)
                  ? { ...q, active: true, operatorsActive: Math.min(q.operatorsActive + 1, q.operatorsTotal) }
                  : q,
              ),
            };
          }
        }),
      setTidsstyringActive: (v) => set({ tidsstyringActive: v }),
      setTidsstyringTimeRange: (from, to, queueCount) => set({ tidsstyringTimeFrom: from, tidsstyringTimeTo: to, tidsstyringQueueCount: queueCount, tidsstyringConfigured: true }),
      setTidsstyringDays: (days) => set({ tidsstyringDays: days }),
      setLoginMode: (mode) => set({ loginMode: mode }),
      deleteTidsstyring: () => set({
        tidsstyringConfigured: false,
        tidsstyringActive: false,
        tidsstyringQueueCount: 0,
      }),
      setSelectedDisplayNumber: (id) =>
        set({
          selectedDisplayNumberId: id,
          // "Mitt nummer" forces external-only off (and locks it).
          // Any other number turns it on by default.
          externalOnly: id !== 'mitt-nummer',
        }),
      setExternalOnly: (v) => set({ externalOnly: v }),
      toggleQueueActive: (queueId) =>
        set((s) => ({
          queues: s.queues.map((q) => {
            if (q.id !== queueId) return q;
            const nowActive = !q.active;
            return {
              ...q,
              active: nowActive,
              operatorsActive: nowActive
                ? Math.min(q.operatorsActive + 1, q.operatorsTotal)
                : Math.max(q.operatorsActive - 1, 0),
            };
          }),
        })),
      setQueuesActive: (states) =>
        set((s) => ({
          queues: s.queues.map((q) => {
            const nowActive = states[q.id] ?? false;
            return {
              ...q,
              active: nowActive,
              operatorsActive: nowActive
                ? Math.min(q.operatorsActive + 1, q.operatorsTotal)
                : Math.max(q.operatorsActive - 1, 0),
            };
          }),
        })),
      reset: () => set(initialState),

      // ── Multi-period actions ──────────────────────────────────────────────
      addTimePeriod: (period) =>
        set((s) => {
          const newPeriod: TimePeriod = { id: `period-${Date.now()}`, ...period };
          const periods = [...s.timePeriods, newPeriod];
          // Sync first period to flat fields for backwards compat
          const first = periods[0];
          return {
            timePeriods: periods,
            tidsstyringConfigured: true,
            tidsstyringTimeFrom: first.timeFrom,
            tidsstyringTimeTo: first.timeTo,
            tidsstyringDays: first.days,
            tidsstyringQueueCount: Object.values(first.queueAssignments).filter((q) => q.loggedIn).length,
            selectedDisplayNumberId: first.displayNumberId,
            externalOnly: first.externalOnly,
          };
        }),

      updateTimePeriod: (id, data) =>
        set((s) => {
          const periods = s.timePeriods.map((p) => (p.id === id ? { ...data, id } : p));
          const first = periods[0];
          return {
            timePeriods: periods,
            ...(first && {
              tidsstyringTimeFrom: first.timeFrom,
              tidsstyringTimeTo: first.timeTo,
              tidsstyringDays: first.days,
              tidsstyringQueueCount: Object.values(first.queueAssignments).filter((q) => q.loggedIn).length,
              selectedDisplayNumberId: first.displayNumberId,
              externalOnly: first.externalOnly,
            }),
          };
        }),

      deleteTimePeriod: (id) =>
        set((s) => {
          const periods = s.timePeriods.filter((p) => p.id !== id);
          const first = periods[0];
          return {
            timePeriods: periods,
            tidsstyringConfigured: periods.length > 0,
            tidsstyringActive: periods.length > 0 ? s.tidsstyringActive : false,
            tidsstyringQueueCount: first
              ? Object.values(first.queueAssignments).filter((q) => q.loggedIn).length
              : 0,
            ...(first && {
              tidsstyringTimeFrom: first.timeFrom,
              tidsstyringTimeTo: first.timeTo,
              tidsstyringDays: first.days,
              selectedDisplayNumberId: first.displayNumberId,
              externalOnly: first.externalOnly,
            }),
          };
        }),

      finalizeWizardPeriod: () =>
        set((s) => {
          // Build a TimePeriod snapshot from the current flat store fields
          const period: TimePeriod = {
            id: s.timePeriods.length > 0 ? s.timePeriods[0].id : `period-${Date.now()}`,
            timeFrom: s.tidsstyringTimeFrom,
            timeTo: s.tidsstyringTimeTo,
            days: s.tidsstyringDays,
            displayNumberId: s.selectedDisplayNumberId ?? 'mitt-nummer',
            externalOnly: s.externalOnly,
            queueAssignments: Object.fromEntries(
              s.queues.map((q) => [q.id, { loggedIn: q.active, smsVarsling: q.active }]),
            ),
          };
          const periods =
            s.timePeriods.length > 0
              ? s.timePeriods.map((p, i) => (i === 0 ? period : p))
              : [period];
          return { timePeriods: periods };
        }),
    }),
    {
      name: 'jobbprofil-state',
      version: 10,
    },
  ),
);
