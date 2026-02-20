import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLink, faTimes } from '@fortawesome/free-solid-svg-icons'

import { parseCurrency } from '../../../../utils/currency'
import Loading from '../../../../shared/Loading/Loading'
import Modal from '../../../../shared/Modal/Modal'
import { useAlert } from '../../../../shared/Alert/AlertContext'

import MetasCreate from './MetasCreate'
import MetasList from './MetasList'

const API_URL = import.meta.env.VITE_API_URL;

const getMetas = () => fetch(`${API_URL}/metas`).then(r => r.json());
const createMeta = (payload: { nome: string; valorObjetivo: number; prazo: number; valorAtual?: number }) =>
  fetch(`${API_URL}/metas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());

export default function Metas({ className }: { className?: string }) {
  const nomeMaxLength = 40;
  const { showAlert } = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const [metas, setMetas] = useState<any[]>([]);
  const [form, setForm] = useState({ nome: '', valorObjetivo: '', valorAtual: '', prazo: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ general?: string; nome?: string; valorObjetivo?: string; valorAtual?: string; prazo?: string }>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'valorObjetivo' || name === 'valorAtual') {
      const digits = value.replace(/\D/g, '');
      setForm(prev => ({ ...prev, [name]: digits }));
      return;
    }
    if (name === 'nome') {
      setForm(prev => ({ ...prev, [name]: value.slice(0, nomeMaxLength) }));
      return;
    }
    if (name === 'prazo') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      setForm(prev => ({ ...prev, [name]: digits }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const meta = await getMetas();
      const { metas } = meta ?? {};
      setMetas(metas ?? []);

    } catch (error) {
      showAlert('Erro ao buscar metas.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const nome = form.nome.trim();
    const valorObjetivo = parseCurrency(form.valorObjetivo);
    const valorAtual = parseCurrency(form.valorAtual || '');
    const prazo = Number(form.prazo);
    const anoAtual = new Date().getFullYear();

    const fieldErrors: typeof errors = {};
    let message: string | null = null;

    if (!nome) fieldErrors.nome = 'Informe o nome da meta';
    if (!valorObjetivo) fieldErrors.valorObjetivo = 'Informe o valor da meta';
    if (!prazo) fieldErrors.prazo = 'Informe o prazo da meta';

    if (Object.keys(fieldErrors).length > 0) {
      message = 'Preencha todos os campos obrigatórios.';
      return { isValid: false, fieldErrors, message };
    }

    if (valorObjetivo <= 0) {
      fieldErrors.valorObjetivo = 'O valor da meta deve ser maior que R$0,00';
      message = 'O valor da meta deve ser maior que R$0,00';
      return { isValid: false, fieldErrors, message };
    }

    if (valorAtual < 0 || valorAtual > valorObjetivo) {
      fieldErrors.valorAtual = 'O valor atual deve ser entre R$0,00 e o valor da meta';
      message = 'O valor atual deve ser entre R$0,00 e o valor da meta';
      return { isValid: false, fieldErrors, message };
    }

    if (prazo < anoAtual) {
      fieldErrors.prazo = 'O prazo deve ser maior ou igual ao ano atual';
      message = 'O prazo deve ser maior ou igual ao ano atual';
      return { isValid: false, fieldErrors, message };
    }

    return { isValid: true, fieldErrors: {}, message: null, values: { nome, valorObjetivo, valorAtual, prazo } };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const validation = validateForm();
    if (!validation.isValid) {
      setErrors({ ...validation.fieldErrors, general: validation.message ?? 'Preencha todos os campos obrigatórios' });
      return;
    }

    const { nome, valorObjetivo, valorAtual, prazo } = validation.values;

    try {
      setIsSaving(true);
      await createMeta({
        nome,
        valorObjetivo,
        prazo,
        valorAtual,
      } as any);
      setForm({ nome: '', valorObjetivo: '', valorAtual: '', prazo: '' });
      setIsOpen(false);
      showAlert('Meta criada com sucesso!', 'success');
      fetchData();
    } catch (error) {
      showAlert('Erro ao criar meta.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Loading isLoading={isLoading} message="Carregando metas..." />
      
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

        <MetasList metas={metas} onAddClick={() => setIsOpen(true)} />
      </section>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <header className="mb-4 flex items-center justify-between">
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
        </header>

        <MetasCreate 
          form={form}
          errors={errors}
          isSaving={isSaving}
          nomeMaxLength={nomeMaxLength}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />
      </Modal>
    </>
  )
}