import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const STORED_HASH = import.meta.env.VITE_PASSWORD_HASH as string;
const SESSION_KEY = 'tss_auth';

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function TelenorLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
      <path fillRule="evenodd" clipRule="evenodd" d="M16.0871 11.8088C16.4826 11.8678 16.5626 11.7901 16.615 11.4265C16.7008 10.8719 16.9053 9.9367 17.3832 8.97812C17.9006 7.94442 18.7246 6.8086 19.8772 6.04808C20.8479 5.41582 22.4389 4.71554 23.6707 4.46153C24.6783 4.25085 25.6223 4.21064 26.4324 4.28349C28.097 4.42889 29.0178 4.88992 29.4801 5.48664C29.6515 5.70956 29.7453 5.98456 29.7491 6.1626C29.7623 6.4594 29.629 6.84672 29.1901 7.22695C28.763 7.59323 27.8521 8.05663 26.6098 8.46242C25.3202 8.87949 23.558 9.31991 21.8015 9.71254C20.3306 10.0417 19.4938 10.3218 18.795 10.5519C17.6327 10.9346 17.2824 12.0584 18.0067 12.4016C19.0535 12.8976 19.7082 13.4162 20.2662 13.857C21.1031 14.5239 22.0751 15.3086 23.2818 16.7238C24.3751 18.0215 26.1636 20.4984 26.8073 22.9026C27.5197 25.5421 27.0745 28.0452 25.5376 28.7442C24.0308 29.4307 22.0227 28.4401 20.6131 27.0198C19.2721 25.6717 18.3361 24.0839 17.4559 21.6347C16.6926 19.5295 16.3832 16.4768 16.3845 14.8799C16.3845 14.3479 16.3757 14.2344 16.3978 13.754C16.4489 13.3353 15.2874 12.989 14.039 13.7696C12.6183 14.6578 11.2265 16.2675 10.4048 17.2024C10.0473 17.6104 9.5628 18.2101 9.04936 18.839C8.37249 19.6639 7.62534 20.523 6.94422 21.0033C5.91917 21.7294 4.27227 22.0296 3.11871 21.23C2.47747 20.7845 2.13614 19.9435 2.12542 19.0885C2.11586 18.4866 2.26946 17.942 2.57875 17.4049C2.96517 16.7454 3.60137 16.0377 4.60996 15.2272C5.65292 14.3943 7.31782 13.4522 8.98626 12.801C11.5312 11.8055 14.2713 11.4923 16.0871 11.8088Z" fill="#293351"/>
    </svg>
  );
}

interface Props {
  children: React.ReactNode;
}

export function PasswordGate({ children }: Props) {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem(SESSION_KEY) === '1',
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const hash = await sha256(password);
    if (hash === STORED_HASH) {
      localStorage.setItem(SESSION_KEY, '1');
      setAuthenticated(true);
    } else {
      setError(true);
      setPassword('');
    }
    setLoading(false);
  }

  if (authenticated) return <>{children}</>;

  return (
    <div className="flex h-screen items-center justify-center bg-surface-alt px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-[var(--radius-card)] bg-surface px-8 py-10 shadow-[0_4px_24px_rgba(24,34,63,0.10)]">

        {/* Logo */}
        <TelenorLogo />

        {/* Heading */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl font-medium text-ink-800">MBN Sentralbord</h1>
          <p className="text-sm font-light text-ink-500">Skriv inn passordet for å fortsette</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Passord"
              autoComplete="current-password"
              className={`h-12 w-full rounded-lg border bg-surface pl-4 pr-11 text-base font-light text-ink-800 outline-none transition focus:border-brand-500 ${
                error ? 'border-red-400' : 'border-ink-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Skjul passord' : 'Vis passord'}
              className="absolute right-3 text-ink-400 transition hover:text-ink-600"
            >
              {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
            </button>
          </div>

          {error && (
            <p className="text-sm font-light text-red-500">Feil passord. Prøv igjen.</p>
          )}

          <button
            type="submit"
            disabled={loading || password.length === 0}
            className="flex h-12 w-full items-center justify-center rounded-full bg-brand-500 text-base font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
          >
            {loading ? 'Sjekker…' : 'Logg inn'}
          </button>
        </form>

      </div>
    </div>
  );
}
