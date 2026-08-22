import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { SubmitEvent } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

   async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Invalid username or password');

      navigate('/login');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 tablet:p-8">
      <div className="grid grid-cols-1 tablet:grid-cols-2 w-full max-w-5xl border border-rule rounded-[4px] bg-paper shadow-[0_18px_40px_-28px_rgba(28,23,20,0.45)] overflow-hidden">
        {/* Left panel */}
        <div className="bg-ink p-8 tablet:p-14 flex flex-col gap-8 tablet:gap-0 tablet:justify-between">
          <span className="font-serif text-[22px] tracking-[0.04em] text-paper">Tastes Smokey</span>

          <h1 className="font-serif font-light text-[34px] tablet:text-[52px] leading-[1.1] text-paper text-pretty">
            Keep a record of every dram worth remembering.
          </h1>

          <p className="font-sans text-[16px] leading-[1.6] text-text-on-dark-muted max-w-sm tablet:mt-5">
            A private logbook of what you've poured, and a shared library of notes for everything else.
          </p>

          <span className="font-sans text-[12px] tracking-[0.14em] uppercase text-[#6E645A]">EST. 2026</span>
        </div>

        {/* Right panel */}
        <div className="p-8 tablet:p-14 flex items-center justify-center">
          <div className="w-full max-w-xs">
            <h2 className="font-serif text-[34px] text-ink mb-7">Create an account</h2>

            <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-5">
              <div>
                <label className="block font-sans text-[11px] tracking-[0.16em] uppercase text-text-label mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full py-3 px-3.5 border border-rule rounded-[2px] bg-paper-raised text-[15px] text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-[11px] tracking-[0.16em] uppercase text-text-label mb-2">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full py-3 px-3.5 border border-rule rounded-[2px] bg-paper-raised text-[15px] text-ink focus:border-accent focus:outline-none"
                />
              </div>

              {error && <p className="text-[13px] text-accent">{error}</p>}

              <button
                type="submit"
                className="w-full py-3.5 rounded-[2px] bg-accent text-paper text-[13px] font-semibold tracking-[0.14em] uppercase hover:bg-accent-hover transition-colors"
              >
                Join the book
              </button>
            </form>

            <p className="mt-6 text-[14px] text-text-muted">
              Already have an account? <Link to="/login" className="text-accent underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;