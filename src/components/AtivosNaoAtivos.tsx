import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faDollarSign, faChartPie, faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import { formatValue } from '../utils/formatValue'

type Labels = Record<string, string>

export default function AtivosNaoAtivos({
  className,
  ativos,
  title = 'Ativos',
  labels = {},
}: {
  className?: string
  ativos?: any[]
  title?: string
  labels?: Labels
}) {
  const humanize = (key: string) => {
    if (key === 'FGTS') return 'FGTS'
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (c) => c.toUpperCase())
  }

  const getIconForField = (key: string) => {
    if (key.toLowerCase().includes('salário') || key.toLowerCase().includes('contas')) return faDollarSign
    if (key.toLowerCase().includes('investimento')) return faChartLine
    if (key.toLowerCase().includes('reserva') || key.toLowerCase().includes('emergência')) return faPiggyBank
    return faChartPie
  }

  // agora usamos util `formatValue` importado

  const totalAtivosNumber = (ativos ?? []).reduce((sum, obj) => {
    const objSum = Object.entries(obj)
      .filter(([k]) => k !== 'ano')
      .reduce((s, [, v]) => (typeof v === 'number' ? s + v : s), 0)
    return sum + objSum
  }, 0)

  const totalAtivos = formatValue(totalAtivosNumber)

  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <p className="text-lg">{title}</p>

      {(ativos ?? []).map((ativo, index) => (
        <article key={index} className="flex flex-col gap-5">
          {ativo.ano && <p className="font-medium">{ativo.ano}</p>}

          {Object.entries(ativo)
            .filter(([k]) => k !== 'ano')
            .map(([k, v]) => (
              <div key={k} className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <FontAwesomeIcon icon={getIconForField(k)} className="text-white bg-blue-500 w-4 h-4 rounded-full p-2" />
                  <p className="font-small">{labels[k] ?? humanize(k)}</p>
                </div>
                <p className="font-small">{formatValue(v)}</p>
              </div>
            ))}
        </article>
      ))}

      <footer className="flex flex-row justify-between mt-2 bg-gray-100 p-4 rounded-lg items-center">
        <div className="flex items-center gap-2">
          <p className="font-medium">{title}</p>
        </div>
        <small className="text-gray-600 font-medium">{totalAtivos}</small>
      </footer>
    </section>
  )
}