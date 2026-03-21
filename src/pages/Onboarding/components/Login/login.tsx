import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import InputField from "@/shared/InputField/inputField";
import { useAlert } from "@/shared/Alert/AlertContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const CADASTROS_API = `${API_URL}/api/cadastros`;

export default function Login() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !senha) {
      showAlert("Informe e-mail e senha", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${CADASTROS_API}/autenticar?email=${encodeURIComponent(email.trim().toLowerCase())}&senha=${encodeURIComponent(senha)}`,
        {
        method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || data.error || "Nao foi possivel entrar", "error");
        return;
      }

      localStorage.setItem("yuni_user", JSON.stringify(data));
      showAlert("Login realizado com sucesso", "success");
      navigate('/home');
    } catch {
      showAlert("Erro ao conectar com o servidor", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className='flex flex-col justify-between gap-8 p-4 h-screen items-center'>
      <div></div>

      <section className='flex flex-col justify-between items-center w-full'>
       <form className="flex flex-col gap-4 w-full" onSubmit={login}>
          <InputField
            id="email"
            name="email"
            // label="E-mail"
            icon={faEnvelope}
            placeholder="Digite seu e-mail"
            maxLength={60}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)} />
            
            <InputField
            id="senha"
            name="senha"
            // label="Senha"
            icon={faLock}
            type="password"
            placeholder="Digite sua senha"
            maxLength={30}
            value={senha}
            onChange={(event) => setSenha(event.target.value)} />

            <button
              type="submit"
              disabled={isSubmitting}
              className='bg-blue-400 text-white px-8 py-2 rounded-4xl disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
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