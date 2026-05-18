interface ToggleProps {
  on: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  ariaLabel?: string;
  disabled?: boolean;
}

export function Toggle({ on, onChange, size = 'md', ariaLabel, disabled = false }: ToggleProps) {
  const trackW = size === 'sm' ? 'w-8' : 'w-9';
  const trackH = size === 'sm' ? 'h-[18px]' : 'h-5';
  const handle = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const translate = size === 'sm' ? 'translate-x-3.5' : 'translate-x-4';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onClick={() => !disabled && onChange(!on)}
      className={`relative inline-flex ${trackW} ${trackH} shrink-0 items-center rounded-full transition-colors duration-150 outline-none ${
        disabled
          ? 'cursor-not-allowed'
          : 'cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500/40'
      } ${on ? 'bg-brand-500' : 'bg-ink-400'}`}
    >
      <span
        className={`absolute left-0.5 top-1/2 -translate-y-1/2 transform rounded-full bg-white shadow transition-transform duration-150 ${handle} ${
          on ? translate : 'translate-x-0'
        }`}
      />
    </button>
  );
}
