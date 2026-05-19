import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TopNav } from './components/TopNav';
import { useJobProfile } from './store/jobProfileStore';
import { MinStatusPanel } from './components/MinStatusPanel';
import { JobbprofilPanel } from './components/JobbprofilPanel';
import { OtherCallsPanel } from './components/OtherCallsPanel';
import { CataloguePanel } from './components/CataloguePanel';
import { SettingsPage } from './components/SettingsPage';
import { IKoPanel } from './components/IKoPanel';
import { MineKoerPanel } from './components/MineKoerPanel';

type AppView = 'main' | 'settings';

export default function App() {
  const [navTab, setNavTab] = useState<'sentralbord' | 'mitt-mbn'>('sentralbord');
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [view, setView] = useState<AppView>('main');
  const reset = useJobProfile((s) => s.reset);

  function handleLogout() {
    reset();
    setNavTab('sentralbord');
    setRightCollapsed(false);
    setView('main');
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-alt">
      {/* Top nav */}
      <TopNav activeTab={navTab} onTabChange={setNavTab} onLogout={handleLogout} />

      {view === 'settings' ? (
        <SettingsPage onBack={() => setView('main')} />
      ) : navTab === 'sentralbord' ? (
        /* ── Sentralbord layout ────────────────────────────────────── */
        <div key="sentralbord" className="animate-tab-enter flex flex-1 gap-3 overflow-hidden p-3 md:gap-4 md:p-4">

          {/* Left sidebar — IKo + MineKøer */}
          <aside className="
            hidden md:flex w-full shrink-0 flex-col gap-3
            md:w-[280px] md:gap-4 md:overflow-hidden
            lg:w-[420px]
            xl:w-[460px]
          ">
            <IKoPanel />
            <MineKoerPanel />
          </aside>

          {/* Mobile: stacked */}
          <div className="flex flex-col gap-3 w-full md:hidden">
            <IKoPanel />
            <MineKoerPanel />
            <OtherCallsPanel />
            <CataloguePanel />
          </div>

          {/* Centre column */}
          <main className="hidden md:flex flex-1 flex-col gap-4 overflow-hidden min-w-0">
            <OtherCallsPanel />
            <CataloguePanel />
          </main>

          {/* Right edge strip — desktop only */}
          <aside className="hidden lg:flex shrink-0 flex-col items-center overflow-hidden rounded-[var(--radius-card)] bg-surface p-3 shadow-[0_2px_8px_rgba(24,34,63,0.06)] transition-all duration-200 w-[52px]">
            <button
              type="button"
              onClick={() => setRightCollapsed((v) => !v)}
              aria-label={rightCollapsed ? 'Utvid' : 'Skjul'}
              className="rounded-full p-1 text-brand-500 hover:bg-brand-50 transition"
            >
              {rightCollapsed ? (
                <ChevronLeft size={18} strokeWidth={2} />
              ) : (
                <ChevronRight size={18} strokeWidth={2} />
              )}
            </button>
          </aside>
        </div>
      ) : (
        /* ── Mitt MBN layout (default) ─────────────────────────────── */
        <div key="mitt-mbn" className="animate-tab-enter flex flex-1 gap-3 overflow-hidden p-3 md:gap-4 md:p-4">

          {/* Left sidebar */}
          <aside className="
            hidden md:flex w-full shrink-0 flex-col gap-3
            md:w-[280px] md:gap-4 md:overflow-hidden
            lg:w-[420px]
            xl:w-[460px]
          ">
            <MinStatusPanel />
            <JobbprofilPanel onNavigateToSettings={() => setView('settings')} />
          </aside>

          {/* Mobile: Jobbprofil shown inline above main content */}
          <div className="flex flex-col gap-3 w-full md:hidden">
            <JobbprofilPanel onNavigateToSettings={() => setView('settings')} />
            <OtherCallsPanel />
            <CataloguePanel />
          </div>

          {/* Centre column — fills remaining space, hidden on mobile (shown above) */}
          <main className="hidden md:flex flex-1 flex-col gap-4 overflow-hidden min-w-0">
            <OtherCallsPanel />
            <CataloguePanel />
          </main>

          {/* Right edge strip — desktop only */}
          <aside className="hidden lg:flex shrink-0 flex-col items-center overflow-hidden rounded-[var(--radius-card)] bg-surface p-3 shadow-[0_2px_8px_rgba(24,34,63,0.06)] transition-all duration-200 w-[52px]">
            <button
              type="button"
              onClick={() => setRightCollapsed((v) => !v)}
              aria-label={rightCollapsed ? 'Utvid' : 'Skjul'}
              className="rounded-full p-1 text-brand-500 hover:bg-brand-50 transition"
            >
              {rightCollapsed ? (
                <ChevronLeft size={18} strokeWidth={2} />
              ) : (
                <ChevronRight size={18} strokeWidth={2} />
              )}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
