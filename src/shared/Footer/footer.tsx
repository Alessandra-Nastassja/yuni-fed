import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faWallet, faChartLine, faGear } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="app-footer" aria-label="Navegação principal">
      <nav className="footer-pill">
        <NavLink
          to="/home"
          className={({ isActive }) => `footer-item ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
        >
          <span className="icon" aria-hidden="true">
            <FontAwesomeIcon size='xl' icon={faHouse} />
          </span>
          <p className="text-small">Home</p>
        </NavLink>

        <NavLink
          to="/financas"
          className={({ isActive }) => `footer-item ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
        >
          <span className="icon" aria-hidden="true">
            <FontAwesomeIcon size='xl' icon={faWallet} />
          </span>
          <p className="text-small">Finanças</p>
        </NavLink>

        <NavLink
          to="/investimentos"
          className={({ isActive }) => `footer-item ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
        >
          <span className="icon" aria-hidden="true">
            <FontAwesomeIcon size='xl' icon={faChartLine} />
          </span>
          <p className="text-small">Investimentos</p>
        </NavLink>

        <NavLink
          to="/configuracoes"
          className={({ isActive }) => `footer-item ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
        >
          <span className="icon" aria-hidden="true">
            <FontAwesomeIcon size='xl' icon={faGear} />
          </span>
          <p className="text-small">Configurações</p>
        </NavLink>
      </nav>
    </footer>
  );
}
