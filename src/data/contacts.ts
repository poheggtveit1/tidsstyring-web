import type { Contact } from '../types/contacts';

export const CONTACTS: Contact[] = [
  { id: '1',  initial: 'A', status: 'Ledig',     hasTeams: true, vip: false, firstName: 'Jonas',     lastName: 'Smogeli',          phone: '05900482',    department: 'Administrasjon' },
  { id: '2',  initial: 'L', status: 'Borte',     hasTeams: true, vip: false, firstName: 'Leah',      lastName: 'Gran Solheim',     phone: '98 39 57 00', department: 'Økonomi' },
  { id: '3',  initial: 'A', status: 'Ledig',     hasTeams: true, vip: true,  firstName: 'Eline',     lastName: 'Kvarme',           phone: '15 61 83 57', department: 'Økonomi' },
  { id: '4',  initial: 'S', status: 'Frakoblet', hasTeams: true, vip: false, firstName: 'Simen',     lastName: 'Holm',             phone: '834 17 946',  department: 'Administrasjon' },
  { id: '5',  initial: 'A', status: 'Opptatt',   hasTeams: true, vip: false, firstName: 'Sindre',    lastName: 'Martinsen',        phone: '05 36 88 13', department: 'Salg' },
  { id: '6',  initial: 'A', status: 'Frakoblet', hasTeams: true, vip: true,  firstName: 'Lars',      lastName: 'Sørensen',         phone: '570 96 894',  department: 'Kundeservice' },
  { id: '7',  initial: 'A', status: 'Borte',     hasTeams: true, vip: false, firstName: 'Kasper',    lastName: 'Sørensen',         phone: '82452120',    department: 'Administrasjon' },
  { id: '8',  initial: 'S', status: 'Opptatt',   hasTeams: true, vip: false, firstName: 'Sebastian', lastName: 'Thoresen',         phone: '50 13 34 68', department: 'Økonomi' },
  { id: '9',  initial: 'N', status: 'Ledig',     hasTeams: true, vip: true,  firstName: 'Noah',      lastName: 'Amundsen Andersen',phone: '73 71 14 77', department: 'Salg' },
  { id: '10', initial: 'M', status: 'Ledig',     hasTeams: true, vip: false, firstName: 'Madeleine', lastName: 'Moen',             phone: '62 99 22 42', department: 'Kundeservice' },
];
