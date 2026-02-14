import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faDollarSign, faPiggyBank, faCar, faHouse } from '@fortawesome/free-solid-svg-icons'
import { formatValue } from '../utils/formatValue'

type Labels = Record<string, string>

export default function AtivosNaoAtivos({
  className,
  ativos,
  title = 'Ativos',
  labels = {},
  iconColor,
}: {
  className?: string
  ativos?: any[]
  title?: string
  labels?: Labels
  iconColor?: string
}) {
  const humanize = (key: string) => {
    if (key === 'FGTS') return 'FGTS'
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (c) => c.toUpperCase())
  }

  const getIconForField = (key: string) => {
    if (key.toLowerCase().includes('investimento')) return faChartLine
    if (key.toLowerCase().includes('reserva') || key.toLowerCase().includes('emergência')) return faPiggyBank
    if (key.toLowerCase().includes('veículos')) return faCar
    if (key.toLowerCase().includes('imóveis')) return faHouse
    return faDollarSign
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
            .map(([k, v]) => {
              const isObject = typeof v === 'object' && v !== null
              const displayValue = isObject ? (v as any).valor : v
              const description = isObject ? (v as any).descricao : undefined

              return (
                <div key={k} className="flex justify-between gap-2">
                  <div className="flex gap-3 flex-1">
                    <div className={`flex items-center justify-center w-7 h-7 ${iconColor} rounded-full`}>
                      <FontAwesomeIcon size='sm' icon={getIconForField(k)} className="text-white" />
                    </div>
                    <div className='flex flex-col'>
                      <p className="text-base">{labels[k] ?? humanize(k)}</p>
                      {description && <small className="text-gray-500">{description}</small>}
                    </div>
                  </div>
                  <p className="text-base">{formatValue(displayValue)}</p>
                </div>
              )
            })}
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