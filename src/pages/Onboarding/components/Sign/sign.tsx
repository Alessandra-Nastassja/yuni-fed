import {
	faEnvelope,
	faLock,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import InputField from "@/shared/InputField/inputField";

export default function Sign() {
	const navigate = useNavigate();

	const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		navigate("/home");
	};

	return (
		<main className="flex h-screen flex-col items-center justify-between gap-8 p-4">
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
					/>

					<InputField
						id="email"
						name="email"
						icon={faEnvelope}
						type="email"
						placeholder="Digite seu e-mail"
						maxLength={60}
					/>

					<InputField
						id="senha"
						name="senha"
						icon={faLock}
						type="password"
						placeholder="Digite sua senha"
						maxLength={30}
					/>

					<InputField
						id="confirmarSenha"
						name="confirmarSenha"
						icon={faLock}
						type="password"
						placeholder="Digite novamente sua senha"
						maxLength={30}
					/>

					{/* <small className="px-2 text-center text-xs text-gray-500">
						Ao continuar voce concorda com as{" "}
						<Link to="/" className="font-semibold text-blue-600 hover:underline">
							Politicas de privacidade
						</Link>{" "}
						e{" "}
						<Link to="/" className="font-semibold text-blue-600 hover:underline">
							Termos de uso
						</Link>
					</small> */}

					<button
						type="submit"
						className="rounded-4xl bg-blue-400 px-8 py-2 font-semibold text-white transition hover:bg-blue-600"
					>
						Cadastrar
					</button>
				</form>

				<p className="text-sm text-gray-500">
					Já é cadastrado?{" "}
					<Link to="/login" className="font-semibold text-blue-400 hover:underline">
						Entrar
					</Link>
				</p>
			</section>

			<footer className="h-8" />
		</main>
	);
}
