import { useState } from 'react';
import { Bell, MessageSquare, Pause, LogOut, Menu } from 'lucide-react';
import { NavSidebar } from './NavSidebar';

function TelenorLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
      <path fillRule="evenodd" clipRule="evenodd" d="M16.0871 11.8088C16.4826 11.8678 16.5626 11.7901 16.615 11.4265C16.7008 10.8719 16.9053 9.9367 17.3832 8.97812C17.9006 7.94442 18.7246 6.8086 19.8772 6.04808C20.8479 5.41582 22.4389 4.71554 23.6707 4.46153C24.6783 4.25085 25.6223 4.21064 26.4324 4.28349C28.097 4.42889 29.0178 4.88992 29.4801 5.48664C29.6515 5.70956 29.7453 5.98456 29.7491 6.1626C29.7623 6.4594 29.629 6.84672 29.1901 7.22695C28.763 7.59323 27.8521 8.05663 26.6098 8.46242C25.3202 8.87949 23.558 9.31991 21.8015 9.71254C20.3306 10.0417 19.4938 10.3218 18.795 10.5519C17.6327 10.9346 17.2824 12.0584 18.0067 12.4016C19.0535 12.8976 19.7082 13.4162 20.2662 13.857C21.1031 14.5239 22.0751 15.3086 23.2818 16.7238C24.3751 18.0215 26.1636 20.4984 26.8073 22.9026C27.5197 25.5421 27.0745 28.0452 25.5376 28.7442C24.0308 29.4307 22.0227 28.4401 20.6131 27.0198C19.2721 25.6717 18.3361 24.0839 17.4559 21.6347C16.6926 19.5295 16.3832 16.4768 16.3845 14.8799C16.3845 14.3479 16.3757 14.2344 16.3978 13.754C16.4489 13.3353 15.2874 12.989 14.039 13.7696C12.6183 14.6578 11.2265 16.2675 10.4048 17.2024C10.0473 17.6104 9.5628 18.2101 9.04936 18.839C8.37249 19.6639 7.62534 20.523 6.94422 21.0033C5.91917 21.7294 4.27227 22.0296 3.11871 21.23C2.47747 20.7845 2.13614 19.9435 2.12542 19.0885C2.11586 18.4866 2.26946 17.942 2.57875 17.4049C2.96517 16.7454 3.60137 16.0377 4.60996 15.2272C5.65292 14.3943 7.31782 13.4522 8.98626 12.801C11.5312 11.8055 14.2713 11.4923 16.0871 11.8088Z" fill="#293351"/>
    </svg>
  );
}

type NavTab = 'sentralbord' | 'mitt-mbn';

interface TopNavProps {
  activeTab: NavTab;
  onTabChange: (t: NavTab) => void;
  onLogout: () => void;
}

export function TopNav({ activeTab, onTabChange, onLogout }: TopNavProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-ink-200 bg-surface px-4">
      {/* Left: logo + hamburger */}
      <div className="flex items-center gap-2">
        <TelenorLogo />
        <button
          type="button"
          aria-label="Meny"
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-brand-500 hover:bg-brand-50 transition"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>
      </div>

      {sidebarOpen && <NavSidebar onClose={() => setSidebarOpen(false)} onReset={onLogout} />}

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
