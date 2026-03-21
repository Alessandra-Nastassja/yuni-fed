import { useNavigate } from 'react-router-dom';

export default function Configuracoes() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('yuni_user');
    navigate('/login', { replace: true });
  };

  return (
    <main className='m-4 space-y-4 p-4'>
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800">Conta</h2>
        <p className="mt-1 text-sm text-gray-500">Encerrar a sessão atual neste dispositivo.</p>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
        >
          Sair
        </button>
      </section>
    </main>
  );
}
