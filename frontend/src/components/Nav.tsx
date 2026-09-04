import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo__100x100.svg';

function Nav({ isLoggedIn, onLogout }: { isLoggedIn: boolean; onLogout: () => void }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const username = localStorage.getItem('username');

  function linkClass(path: string) {
    const active = location.pathname === path;
    return `pb-0.5 ${active ? 'text-paper border-b border-accent' : 'text-nav-inactive hover:text-paper'}`;
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <nav className="bg-ink px-6 tablet:px-8 py-4 relative">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl tracking-[0.04em] text-paper" onClick={closeMobile}>
          <img src={logo} alt="" className="w-7 h-7" />
          Tastes Smokey
        </Link>

        {/* Desktop nav (900px and up) */}
        <div className="hidden tablet:flex items-center gap-7 font-sans text-[13px] tracking-[0.12em] uppercase">
          {isLoggedIn ? (
            <>
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
            </>
          ) : (
            <>
              <Link to="/login" className="text-nav-inactive hover:text-paper">Login</Link>
              <Link to="/register" className="text-nav-inactive hover:text-paper">Register</Link>
            </>
          )}
        </div>

        {/* Hamburger (below 900px) */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="tablet:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5"
          aria-label="Menu"
        >
          <span className={`block w-6 h-[1.5px] bg-paper transition-transform ${mobileOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block w-6 h-[1.5px] bg-paper transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[1.5px] bg-paper transition-transform ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="tablet:hidden mt-4 flex flex-col font-sans text-[13px] tracking-[0.12em] uppercase">
          {isLoggedIn ? (
            <>
              <Link to="/" onClick={closeMobile} className="py-3 border-t border-white/10 text-nav-inactive">
                Collection
              </Link>
              <Link to="/whiskies/new" onClick={closeMobile} className="py-3 border-t border-white/10 text-nav-inactive">
                Add whiskey
              </Link>
              <button
                onClick={() => {
                  closeMobile();
                  onLogout();
                }}
                className="py-3 border-t border-b border-white/10 text-left text-nav-inactive"
              >
                Logout ({username})
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobile} className="py-3 border-t border-white/10 text-nav-inactive">
                Login
              </Link>
              <Link to="/register" onClick={closeMobile} className="py-3 border-t border-b border-white/10 text-nav-inactive">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Nav;
