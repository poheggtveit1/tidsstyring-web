import type { ContactStatus } from '../types/contacts';

const STATUS_DOT: Record<ContactStatus, string> = {
  Ledig:     'bg-[#178122]',
  Borte:     'bg-[#f57c00]',
  Frakoblet: 'bg-[#7c88ab]',
  Opptatt:   'bg-[#d32f2f]',
};

const BG_COLOURS = [
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-amber-100 text-amber-800',
  'bg-teal-100 text-teal-800',
  'bg-rose-100 text-rose-800',
  'bg-indigo-100 text-indigo-800',
];

interface AvatarProps {
  initial: string;
  size?: 'sm' | 'md';
  status?: ContactStatus;
}

export function Avatar({ initial, size = 'md', status }: AvatarProps) {
  const idx = (initial.charCodeAt(0) - 65) % BG_COLOURS.length;
  const colour = BG_COLOURS[Math.max(0, idx)];
  const sz = size === 'sm' ? 'h-9 w-9 text-sm' : 'h-10 w-10 text-base';

  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`inline-flex items-center justify-center rounded-full font-medium ${colour} ${sz}`}
      >
        {initial}
      </span>
      {status && (
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-surface ${STATUS_DOT[status]}`}
        />
      )}
    </span>
  );
}
