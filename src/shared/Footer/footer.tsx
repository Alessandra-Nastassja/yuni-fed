import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="app-footer" aria-label="Navegação principal">
      <nav className="footer-pill">
        <NavLink
          to="/home"
          className={({ isActive }) => `footer-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 10v10h14V10" />
            </svg>
          </span>
          <span className="label">Home</span>
        </NavLink>

        <NavLink
          to="/financas"
          className={({ isActive }) => `footer-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 9h6M7 13h10" />
            </svg>
          </span>
          <span className="label">Finanças</span>
        </NavLink>

        <NavLink
          to="/investimentos"
          className={({ isActive }) => `footer-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 16l4-4 4 4 6-6" />
              <path d="M20 10V4h-6" />
            </svg>
          </span>
          <span className="label">Investimentos</span>
        </NavLink>

        <NavLink
          to="/configuracoes"
          className={({ isActive }) => `footer-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a7.97 7.97 0 0 0 0-6l2-1.2-2-3.5-2.3.8a8.1 8.1 0 0 0-5.2-3l-.5-2.4H10l-.5 2.4a8.1 8.1 0 0 0-5.2 3l-2.3-.8-2 3.5 2 1.2a7.97 7.97 0 0 0 0 6l-2 1.2 2 3.5 2.3-.8a8.1 8.1 0 0 0 5.2 3l.5 2.4h4l.5-2.4a8.1 8.1 0 0 0 5.2-3l2.3.8 2-3.5-2-1.2z" />
            </svg>
          </span>
          <span className="label">Configurações</span>
        </NavLink>
      </nav>
    </footer>
  );
}
