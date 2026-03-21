import { Link } from "react-router-dom";

export default function Logando() {
  return (
    <main className='flex flex-col justify-between gap-8 p-4 h-screen items-center'>
      <p></p>
      <section className='flex flex-col justify-center items-center'>
        <h1 className="text-2xl font-semibold mb-4 text-blue-400">yuni</h1>
        <p className='text-base text-gray-500 text-center'>Controle seus investimentos de forma simples e segura.</p>
      </section>

      <footer className="flex flex-col gap-4">
        <Link to="/cadastrar" className="text-center">
          <button className='bg-blue-400 text-white px-8 py-2 rounded-4xl'>Começar agora</button>
        </Link>
        <Link to="/login" className="text-center">
          <button className='text-sm text-blue-400 hover:underline'>Já tenho uma conta</button>
        </Link>
      </footer>
    </main>
  );
}