import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";

import InputField from "@/shared/InputField/inputField";

export default function Login() {
  const navigate = useNavigate();

  const login = () => {
    navigate('/home');
  }

  return (
    <main className='flex flex-col justify-between gap-8 p-4 h-screen items-center'>
      <header>
        <Link to="/" className="text-blue-600 hover:underline">
          <FontAwesomeIcon icon={faClose} size='2xl' className='absolute top-4 left-4 cursor-pointer text-gray-300' />
        </Link>
      </header>

      <section className='flex flex-col justify-between items-center w-full'>
       <form className="flex flex-col gap-4 w-full">
          <InputField
            id="nome"
            name="nome"
            // label="Nome"
            // icon={faTag}
            placeholder="Digite seu usuário"
            maxLength={30} />
            
            <InputField
            id="email"
            name="email"
            // label="Nome"
            // icon={faTag}
            placeholder="Digite sua senha"
            maxLength={30} />
            <button 
            className='bg-blue-400 text-white px-8 py-2 rounded-4xl'
            onClick={login}>Entrar</button>
        </form>
      </section>

      <footer className="text-center">
        <small className='text-sm text-gray-500'>
          Ao entrar no Yuni, você concorda com os nossos Termos e Política de Privacidade.
        </small>
      </footer>
    </main>
  )
}