import { useLocation, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = {
    '/home': 'Home',
    '/financas': 'Finanças',
    '/patrimonio': 'Patrimônio',
    '/configuracoes': 'Configurações',
    '/novo-ativo': 'Criar ativo',
    '/novo-nao-ativo': 'Criar não ativo',
  }[location.pathname] || '';

  const bgColor = {
    '/home': 'bg-blue-400',
    '/financas': 'bg-blue-400',
    '/patrimonio': 'bg-blue-400',
    '/novo-ativo': 'bg-blue-700',
    '/novo-nao-ativo': 'bg-blue-400',
    '/configuracoes': 'bg-blue-400',
  }[location.pathname] || 'bg-blue-400';

  return (
    <>
      {['/', '/home'].includes(location.pathname) === false && (
        <header className={`flex flex-row p-5 gap-5 items-center justify-start relative h-15 ${bgColor}`}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
            aria-label="Voltar"
          >

            {['/financas', '/patrimonio', '/configuracoes'].includes(location.pathname) ? (
              <FontAwesomeIcon icon={faArrowLeft} size='sm' className='left-4 cursor-pointer text-white' />
            ): (
              <FontAwesomeIcon icon={faClose} size='sm' className='left-4 cursor-pointer text-white' />
            )}
          </button>
          <p className="text-white text-medium">{pageTitle}</p>
        </header>
      )}
    </>
  )
}