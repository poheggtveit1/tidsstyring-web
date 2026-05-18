import { Bell, MessageSquare, Pause, LogOut, Menu } from 'lucide-react';

// Simple Telenor-style T logo placeholder
function TelenorLogo() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-white text-sm font-bold">
      T
    </div>
  );
}

type NavTab = 'sentralbord' | 'mitt-mbn';

interface TopNavProps {
  activeTab: NavTab;
  onTabChange: (t: NavTab) => void;
  onLogout: () => void;
}

export function TopNav({ activeTab, onTabChange, onLogout }: TopNavProps) {
  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-ink-200 bg-surface px-4">
      {/* Left: logo + hamburger */}
      <div className="flex items-center gap-2">
        <TelenorLogo />
        <button
          type="button"
          aria-label="Meny"
          className="flex h-9 w-9 items-center justify-center rounded-full text-brand-500 hover:bg-brand-50 transition"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>
      </div>

      {/* Centre: segmented control */}
      <div className="flex items-center gap-1 rounded-full bg-ink-200 p-1">
        <button
          type="button"
          onClick={() => onTabChange('sentralbord')}
          className={`flex h-9 items-center rounded-full px-4 text-sm font-medium transition ${
            activeTab === 'sentralbord'
              ? 'bg-surface text-brand-500 shadow-sm'
              : 'text-ink-900 hover:bg-ink-100'
          }`}
        >
          Sentralbord
        </button>
        <button
          type="button"
          onClick={() => onTabChange('mitt-mbn')}
          className={`flex h-9 items-center rounded-full px-4 text-sm font-medium transition ${
            activeTab === 'mitt-mbn'
              ? 'bg-surface text-brand-500 shadow-sm'
              : 'text-ink-900 hover:bg-ink-100'
          }`}
        >
          Mitt MBN
        </button>
      </div>

      {/* Right: version + icon buttons + logout */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-light text-ink-600">v.#.##.#</span>

        {[
          { icon: Bell, label: 'Varsler' },
          { icon: MessageSquare, label: 'Meldinger' },
          { icon: Pause, label: 'Pause' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-500 hover:bg-brand-50 transition"
          >
            <Icon size={18} strokeWidth={1.75} />
          </button>
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-brand-500 hover:bg-brand-50 transition"
        >
          <LogOut size={14} strokeWidth={2} />
          Logg ut
        </button>
      </div>
    </header>
  );
}
