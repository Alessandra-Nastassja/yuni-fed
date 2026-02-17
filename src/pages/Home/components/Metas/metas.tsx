import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLink, faTimes } from '@fortawesome/free-solid-svg-icons'

import { formatValue } from '../../../../utils/formatValue'
import { formatCurrencyInput, parseCurrency } from '../../../../utils/currency'
import Modal from '../../../../shared/Modal/Modal'
import Alert from '../../../../shared/Alert/Alert'

const API_URL = import.meta.env.VITE_API_URL;

const getMetas = () => fetch(`${API_URL}/metas`).then(r => r.json());
const createMeta = (payload: { nome: string; valorMeta: number; prazo: number; valorAtual?: number }) =>
  fetch(`${API_URL}/metas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());

export default function Metas({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [metas, setMetas] = useState<any[]>([]);
  const [form, setForm] = useState({ nome: '', valorMeta: '', valorAtual: '', prazo: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'valorMeta' || name === 'valorAtual') {
      const digits = value.replace(/\D/g, '');
      setForm(prev => ({ ...prev, [name]: digits }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    try {
      const meta = await getMetas();
      const { metas } = meta ?? {};
      setMetas(metas ?? []);
    } catch (error) {
      setError('Erro ao buscar metas.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const nome = form.nome.trim();
    const valorMeta = parseCurrency(form.valorMeta);
    const valorAtual = parseCurrency(form.valorAtual || '');
    const prazo = Number(form.prazo);
    const anoAtual = new Date().getFullYear();

    if (!nome || !valorMeta || !prazo) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (valorMeta <= 0) {
      setError('O valor da meta deve ser maior que 0.');
      return;
    }

    if (valorAtual < 0 || valorAtual > valorMeta) {
      setError('O valor atual deve ser entre 0 e o valor da meta.');
      return;
    }

    if (prazo < anoAtual) {
      setError('O prazo deve ser maior ou igual ao ano atual.');
      return;
    }

    try {
      setIsSaving(true);
      await createMeta({
        nome,
        valorMeta,
        prazo,
        valorAtual,
      } as any);
      setForm({ nome: '', valorMeta: '', valorAtual: '', prazo: '' });
      setIsOpen(false);
      fetchData();
    } catch (error) {
      setError('Erro ao criar meta.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <header className="flex items-center justify-between">
        <p className="text-lg">Metas</p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-sm text-blue-500 hover:underline inline-flex items-center"
        >
          <FontAwesomeIcon size='sm' icon={faExternalLink} className="mr-1 text-gray-400" />
        </button>
      </header>
      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {metas && metas.length > 0 ? (
        metas.map((meta, index) => (
          <div key={index} className="flex flex-col justify-between gap-2">
            <div className='flex justify-between gap-5'>
              <p className="text-base">{meta.nome}</p>

              <div className="flex justify-between gap-1">
                <small className="text-xs text-gray-500">R$ {formatValue(meta.valorAtual ?? 0)}</small>
                <small className="text-xs text-gray-500">de R$ {formatValue(meta.valorMeta)}</small>
              </div>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                className="bg-green-500 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{
                  width: `${meta.valorMeta ? ((Number(meta.valorAtual ?? 0) / Number(meta.valorMeta)) * 100).toFixed(2) : 0}%`,
                }}
              >
                <span className="text-white text-xs font-medium">
                  {meta.valorMeta ? ((Number(meta.valorAtual ?? 0) / Number(meta.valorMeta)) * 100).toFixed(2) : '0.00'}%
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm flex gap-1 text-gray-500">
          Nenhuma meta cadastrada! Cadastre uma 
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-sm text-blue-500 hover:underline inline-flex items-center"
          >
            aqui
          </button>
        </p>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
          <h2 className="text-lg font-semibold">Nova meta</h2>
          <div className="w-8" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-gray-600" htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="Ex.: Minha casa"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600" htmlFor="valorMeta">Valor da meta</label>
            <input
              id="valorMeta"
              name="valorMeta"
              type="text"
              inputMode="numeric"
              value={formatCurrencyInput(form.valorMeta)}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="Ex.: 300000"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600" htmlFor="valorAtual">Valor atual</label>
            <input
              id="valorAtual"
              name="valorAtual"
              type="text"
              inputMode="numeric"
              value={formatCurrencyInput(form.valorAtual)}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="Ex.: 12000"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600" htmlFor="prazo">Prazo (ano)</label>
            <input
              id="prazo"
              name="prazo"
              type="number"
              value={form.prazo}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="Ex.: 2028"
              min={2024}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-full bg-slate-700 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </Modal>
    </section>
  )
}