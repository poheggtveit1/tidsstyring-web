export interface DisplayNumber {
  id: string;
  label: string;       // e.g. "Support"
  number: string;      // e.g. "22 33 44"
}

export interface Queue {
  id: string;
  name: string;        // "Kundeservice"
  number: string;      // "23 00 11 22"
  active: boolean;     // toggle on the row
  inQueue: number | null;
  waitTime: string | null; // formatted "24:38" or null
  operatorsActive: number;
  operatorsTotal: number;
  paused?: boolean;    // marks the warning-yellow row
}

export type LoginMode = 'automatisk' | 'paminnelse';

export interface QueueAssignment {
  loggedIn: boolean;
  smsVarsling: boolean;
}

export interface TimePeriod {
  id: string;
  timeFrom: string;           // "08:00"
  timeTo: string;             // "16:00"
  days: string[];             // ["Mandag", ...]
  displayNumberId: string;    // references DisplayNumber.id
  externalOnly: boolean;
  queueAssignments: Record<string, QueueAssignment>; // keyed by queue id
}

export interface JobProfileState {
  // Master toggle (header)
  enabled: boolean;

  // Tidsstyring (time control)
  tidsstyringActive: boolean;
  tidsstyringConfigured: boolean; // true once wizard has been completed at least once
  tidsstyringStatus: string; // free-text status line ("· logger av 16:00")
  tidsstyringTimeFrom: string;   // "08:00"
  tidsstyringTimeTo: string;     // "16:00"
  tidsstyringQueueCount: number; // how many queues selected in wizard
  tidsstyringDays: string[];     // selected weekdays from wizard
  loginMode: LoginMode;          // på- og avlogging preference

  // Visningsnummer dropdown
  displayNumbers: DisplayNumber[];
  selectedDisplayNumberId: string | null;

  // External-only toggle
  externalOnly: boolean;

  // Queues table
  queues: Queue[];

  // IDs of queues that were active before Jobbprofil was disabled — used to restore on re-enable
  lastActiveQueueIds: string[];

  // Multiple time periods
  timePeriods: TimePeriod[];
}
