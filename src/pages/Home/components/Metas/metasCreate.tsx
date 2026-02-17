import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faDollarSign, faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import { formatCurrencyInput } from '../../../../utils/currency'
import Alert from '../../../../shared/Alert/Alert'

interface FormMetaProps {
  form: { nome: string; valorMeta: string; valorAtual: string; prazo: string }
  errors: { general?: string; nome?: string; valorMeta?: string; valorAtual?: string; prazo?: string }
  isSaving: boolean
  nomeMaxLength: number
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function MetasCreate({ form, errors, isSaving, nomeMaxLength, onSubmit, onChange }: FormMetaProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-1">
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${errors.nome ? 'border-red-400' : 'border-gray-200'}`}>
          <FontAwesomeIcon icon={faTag} className="text-gray-400" />
          <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={form.nome}
            onChange={onChange}
            className="w-full bg-transparent outline-none"
            placeholder="Nome da meta"
            aria-invalid={!!errors.nome}
            maxLength={nomeMaxLength}
          />
        </div>
        {
          form.nome.length != 0 &&
          <p className="text-xs text-right text-gray-400">
            {nomeMaxLength - form.nome.length} caracteres restantes
          </p>
        }
        {errors.nome && <p className="text-xs text-red-500">{errors.nome}</p>}
      </div>

      <div className="space-y-1">
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${errors.valorMeta ? 'border-red-400' : 'border-gray-200'}`}>
          <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
          <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorMeta">Valor da meta</label>
          <input
            id="valorMeta"
            name="valorMeta"
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(form.valorMeta)}
            onChange={onChange}
            className="w-full bg-transparent outline-none text-right"
            placeholder="R$ 0,00"
            aria-invalid={!!errors.valorMeta}
          />
        </div>
        {errors.valorMeta && <p className="text-xs text-red-500">{errors.valorMeta}</p>}
      </div>

      <div className="space-y-1">
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${errors.valorAtual ? 'border-red-400' : 'border-gray-200'}`}>
          <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
          <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorAtual">Valor atual</label>
          <input
            id="valorAtual"
            name="valorAtual"
            type="text"
            inputMode="numeric"
            value={formatCurrencyInput(form.valorAtual)}
            onChange={onChange}
            className="w-full bg-transparent outline-none text-right"
            placeholder="R$ 0,00"
            aria-invalid={!!errors.valorAtual}
          />
        </div>
        {errors.valorAtual && <p className="text-xs text-red-500">{errors.valorAtual}</p>}
      </div>

      <div className="space-y-1">
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${errors.prazo ? 'border-red-400' : 'border-gray-200'}`}>
          <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
          <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="prazo">Prazo (ano)</label>
          <input
            id="prazo"
            name="prazo"
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={form.prazo}
            onChange={onChange}
            className="w-full bg-transparent outline-none text-right"
            placeholder="2026"
            aria-invalid={!!errors.prazo}
          />
        </div>
        {errors.prazo && <p className="text-xs text-red-500">{errors.prazo}</p>}
      </div>

      {errors.general && (
        <Alert variant="error">{errors.general}</Alert>
      )}

      <footer className="flex justify-center">
        <button
          type="submit"
          disabled={isSaving}
          className="w-30 rounded-full bg-green-700 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </footer>
    </form>
  )
}
