import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faWallet, faChartLine, faGear } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="app-footer" aria-label="Navegação principal">
      <nav className="footer-pill">
        <NavLink
          to="/home"
          className={({ isActive }) => `footer-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon" aria-hidden="true">
            <FontAwesomeIcon size='xl' icon={faHouse} className='text-gray-500' />
          </span>
          <p className="text-small text-gray-500">Home</p>
        </NavLink>

        <NavLink
          to="/financas"
          className={({ isActive }) => `footer-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon" aria-hidden="true">
            <FontAwesomeIcon size='xl' icon={faWallet} className='text-gray-500' />
          </span>
          <p className="text-small text-gray-500">Finanças</p>
        </NavLink>

        <NavLink
          to="/investimentos"
          className={({ isActive }) => `footer-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon" aria-hidden="true">
            <FontAwesomeIcon size='xl' icon={faChartLine} className='text-gray-500' />
          </span>
          <p className="text-small text-gray-500">Investimentos</p>
        </NavLink>

        <NavLink
          to="/configuracoes"
          className={({ isActive }) => `footer-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon" aria-hidden="true">
            <FontAwesomeIcon size='xl' icon={faGear} className='text-gray-500' />
          </span>
          <p className="text-small text-gray-500">Configurações</p>
        </NavLink>
      </nav>
    </footer>
  );
}
