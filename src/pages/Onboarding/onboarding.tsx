import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import yuni from '../../assets/pig.png';

export default function Onboarding() {
  return (
    <main className='flex flex-col justify-between gap-8 p-4 h-screen items-center'>
      <header>
        <Link to="/home" className="text-blue-600 hover:underline">
          <FontAwesomeIcon icon={faClose} size='2xl' className='absolute top-4 left-4 cursor-pointer text-gray-300' />
        </Link>
      </header>

      <section className='flex flex-col justify-between items-center'>
        <img src={yuni} alt="Yuni" className="w-48 mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-blue-400">Bem-vindo!</h1>
        <p className='text-base text-gray-500'>Olá, eu sou a Yuni! Te ajudarei nessa jornada.</p>
      </section>

      <footer>
        <small className='text-sm text-gray-500'>Desenvolvido por Alessandra Nastassja</small>
      </footer>
    </main>
  );
}
