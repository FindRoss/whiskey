import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Nav({ isLoggedIn, onLogout }: { isLoggedIn: boolean; onLogout: () => void }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const username = localStorage.getItem('username');

  function linkClass(path: string) {
    const active = location.pathname === path;
    return `pb-0.5 ${active ? 'text-paper border-b border-accent' : 'text-nav-inactive hover:text-paper'}`;
  }

  return (
    <nav className="bg-ink px-8 py-4 flex items-center justify-between">
      <Link to="/" className="font-serif text-xl tracking-[0.04em] text-paper">
        Dram Book
      </Link>

      {isLoggedIn ? (
        <div className="flex items-center gap-7 font-sans text-[13px] tracking-[0.12em] uppercase">
          <Link to="/" className={linkClass('/')}>Collection</Link>
          <Link to="/whiskies/new" className={linkClass('/whiskies/new')}>Add whiskey</Link>
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="text-nav-inactive hover:text-paper uppercase">
              {username}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 min-w-[120px] bg-paper border border-rule rounded-[2px] shadow-[0_18px_40px_-28px_rgba(28,23,20,0.45)] overflow-hidden">
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-ink normal-case tracking-normal text-sm hover:bg-row-hover"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-7 font-sans text-[13px] tracking-[0.12em] uppercase">
          <Link to="/login" className="text-nav-inactive hover:text-paper">Login</Link>
          <Link to="/register" className="text-nav-inactive hover:text-paper">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Nav;
