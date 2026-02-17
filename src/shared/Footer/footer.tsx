import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faWallet, faPlus, faChartLine, faGear } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pointer-events-none"
      aria-label="Navegação principal"
    >
      <nav className="pointer-events-auto relative w-full max-w-[520px] rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] grid grid-cols-4 gap-1 px-3 py-2 items-center">
        <NavLink
          to="/home"
          className={({ isActive }) => `flex flex-col items-center justify-center gap-2 text-[0.7rem] px-1 py-1 no-underline ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
        >
          <div className="h-6 w-6" aria-hidden="true">
            <FontAwesomeIcon size='xl' className="h-6 w-6" icon={faHouse} />
          </div>
          <p className="text-xs">Home</p>
        </NavLink>

        <NavLink
          to="/financas"
          className={({ isActive }) => `flex flex-col items-center justify-center gap-2 text-[0.7rem] px-1 py-1 no-underline ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
        >
          <div className="h-6 w-6" aria-hidden="true">
            <FontAwesomeIcon size='xl' className="h-6 w-6" icon={faWallet} />
          </div>
          <p className="text-xs">Finanças</p>
        </NavLink>

        <NavLink
          to="/investimentos"
          className={({ isActive }) => `flex flex-col items-center justify-center gap-2 text-[0.7rem] px-1 py-1 no-underline ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
        >
          <div className="h-6 w-6" aria-hidden="true">
            <FontAwesomeIcon size='xl' className="h-6 w-6" icon={faChartLine} />
          </div>
          <p className="text-xs">Patrimônio</p>
        </NavLink>

        <NavLink
          to="/configuracoes"
          className={({ isActive }) => `flex flex-col items-center justify-center gap-2 text-[0.7rem] px-1 py-1 no-underline ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
        >
          <div className="h-6 w-6" aria-hidden="true">
            <FontAwesomeIcon size='xl' className="h-6 w-6" icon={faGear} />
          </div>
          <p className="text-xs">Configurações</p>
        </NavLink>

        <NavLink
          to="/novo"
          className="absolute -top-15 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-400 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          aria-label="Adicionar"
        >
          <FontAwesomeIcon className="h-5 w-5" icon={faPlus} />
        </NavLink>
      </nav>
    </footer>
  );
}
