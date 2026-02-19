import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <>
      {['/', '/home'].includes(location.pathname) === false && (
        <header className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
            aria-label="Voltar"
          >

            {['/financas', '/patrimonio', '/configuracoes'].includes(location.pathname) ? (
              <FontAwesomeIcon icon={faArrowLeft} size='2xl' className='absolute top-4 left-4 cursor-pointer text-gray-300' />
            ): (
              <FontAwesomeIcon icon={faClose} size='2xl' className='absolute top-4 left-4 cursor-pointer text-gray-300' />
            )}
          </button>
        </header>
      )}
    </>
  )
}