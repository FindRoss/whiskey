import logo from '../assets/logo__30x30.svg';

function Footer() {
  return (
    <footer className="bg-ink px-6 tablet:px-8 py-5 flex items-center justify-center gap-2 text-nav-inactive text-[12px] font-sans tracking-[0.08em] uppercase">
      <img src={logo} alt="" className="w-4 h-4" />
      Made with React, TypeScript, PostgreSQL &amp; Whiskey
    </footer>
  );
}

export default Footer;
