import type { ContactStatus } from '../types/contacts';

const config: Record<ContactStatus, { bg: string; text: string }> = {
  Ledig:     { bg: 'bg-[#D8FDDB]', text: 'text-[#114516]' },
  Borte:     { bg: 'bg-[#FFE5CC]', text: 'text-[#5C2600]' },
  Frakoblet: { bg: 'bg-[#E5E8F0]', text: 'text-[#293351]' },
  Opptatt:   { bg: 'bg-[#FFE0E0]', text: 'text-[#5C0000]' },
};

export function StatusBadge({ status }: { status: ContactStatus }) {
  const { bg, text } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-lg px-1 py-1 text-xs font-light leading-none ${bg} ${text}`}
    >
      {status}
    </span>
  );
}
