import {
	faEnvelope,
	faLock,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import InputField from "@/shared/InputField/inputField";
import { useState } from "react";
import { useAlert } from "@/shared/Alert/AlertContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const CADASTROS_API = `${API_URL}/api/cadastros`;

export default function Sign() {
	const navigate = useNavigate();
	const { showAlert } = useAlert();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
			showAlert("Preencha todos os campos", "warning");
			return;
		}

		if (senha.length < 6) {
			showAlert("A senha deve ter pelo menos 6 caracteres", "warning");
			return;
		}

		if (senha !== confirmarSenha) {
			showAlert("As senhas nao conferem", "error");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch(CADASTROS_API, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nome: nome.trim(),
					email: email.trim().toLowerCase(),
					senha,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				showAlert(data.message || data.error || "Nao foi possivel criar a conta", "error");
				return;
			}

			localStorage.setItem("yuni_user", JSON.stringify(data));
			showAlert("Conta criada com sucesso", "success");
			navigate("/home");
		} catch {
			showAlert("Erro ao conectar com o servidor", "error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="flex h-screen flex-col items-center justify-between gap-8 p-4">
			<div></div>

      <section className="flex w-full max-w-sm flex-col items-center gap-4">
				<p className="text-center text-sm text-gray-500">
					Crie sua conta para começar a ter um controle financeiro mais eficiente e organizado!
				</p>

				<form className="flex w-full flex-col gap-4" onSubmit={handleSignUp}>
					<InputField
						id="nome"
						name="nome"
						icon={faUser}
						placeholder="Digite seu nome completo"
						maxLength={40}
						value={nome}
						onChange={(event) => setNome(event.target.value)}
					/>

					<InputField
						id="email"
						name="email"
						icon={faEnvelope}
						type="email"
						placeholder="Digite seu e-mail"
						maxLength={60}
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>

					<InputField
						id="senha"
						name="senha"
						icon={faLock}
						type="password"
						placeholder="Digite sua senha"
						maxLength={30}
						value={senha}
						onChange={(event) => setSenha(event.target.value)}
					/>

					<InputField
						id="confirmarSenha"
						name="confirmarSenha"
						icon={faLock}
						type="password"
						placeholder="Digite novamente sua senha"
						maxLength={30}
						value={confirmarSenha}
						onChange={(event) => setConfirmarSenha(event.target.value)}
					/>

					<button
						type="submit"
						disabled={isSubmitting}
						className="rounded-4xl bg-blue-400 px-8 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "Cadastrando..." : "Cadastrar"}
					</button>
				</form>

        <p className="text-sm text-gray-500">
					Já é cadastrado?{" "}
					<Link to="/login" className="font-semibold text-blue-400 hover:underline">
						Entrar
					</Link>
				</p>
			</section>

			<footer className="text-center">
        <small className="px-2 text-center text-xs text-gray-500">
						Ao continuar voce concorda com as{" "}
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
	);
}
