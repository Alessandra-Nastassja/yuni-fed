import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

import InputField from "@/shared/InputField/inputField";

export default function Login() {
  const navigate = useNavigate();

  const login = () => {
    navigate('/home');
  }

  return (
    <main className='flex flex-col justify-between gap-8 p-4 h-screen items-center'>
      <div></div>

      <section className='flex flex-col justify-between items-center w-full'>
       <form className="flex flex-col gap-4 w-full">
          <InputField
            id="email"
            name="email"
            // label="E-mail"
            icon={faEnvelope}
            placeholder="Digite seu e-mail"
            maxLength={30} />
            
            <InputField
            id="senha"
            name="senha"
            // label="Senha"
            icon={faLock}
            placeholder="Digite sua senha"
            maxLength={30} />

            <Link to="/home" className="flex flex-col justify-between">
              <button className='bg-blue-400 text-white px-8 py-2 rounded-4xl'onClick={login}>
                Entrar
              </button>
            </Link>
        </form>

        <p className="text-sm text-gray-500 py-4">
					Ainda não tem uma conta?{" "}
					<Link to="/cadastrar" className="font-semibold text-blue-400 hover:underline">
						Cadastrar-se
					</Link>
				</p>
      </section>

      <footer className="text-center">
        <small className='text-sm text-gray-500'>
          Ao entrar no Yuni, você concorda com os nossos {" "}
          <Link to="/" className="font-semibold text-blue-600 hover:underline">
							Politicas de privacidade
						</Link>{" "}
						e{" "}
						<Link to="/" className="font-semibold text-blue-600 hover:underline">
							Termos de uso
						</Link>
        </small>
      </footer>
    </main>
  )
}