export type ContactStatus = 'Ledig' | 'Borte' | 'Frakoblet' | 'Opptatt';

export interface Contact {
  id: string;
  initial: string;
  status: ContactStatus;
  hasTeams: boolean;
  vip: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
}
