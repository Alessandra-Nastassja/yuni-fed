import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { formatValue } from '../../../../utils/formatValue';

export default function Corretoras({ corretoras = [] }: { corretoras?: any[] }) {
  const totalInvestimentos = corretoras.reduce((total, a) => total + a.ativos, 0)

  const getColorClass = (rentabilidade: string) => {
    const valor = parseFloat(rentabilidade.replace('%', '').replace(',', '.'))
    if (valor >= 15) return 'text-green-600'
    if (valor >= 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getIcon = (rentabilidade: string) => {
    const valor = parseFloat(rentabilidade.replace('%', '').replace(',', '.'))
    if (valor >= 15) return faArrowUp
    if (valor >= 10) return faArrowRight
    return faArrowDown
  }

  return (
    <section className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg">
      <p className="text-lg">Corretoras</p>
      <p className="font-medium">2026</p>

      {corretoras.map((ativo) => {
        return (
          <article className='flex flex-row justify-between gap-2' key={ativo.nome}>
            <div className="flex flex-col items-start">
              <p className="text-base font-semibold">{ativo.nome}</p>
              <small className="text-xs bg-blue-300 p-0.5 rounded">{ativo.meta}</small>
            </div>
            <div className="space-y-1 pl-4">
              <div className="flex gap-2 justify-end">
                <div className='flex flex-col items-end'>
                  <p className="text-base">{formatValue(ativo.valor)}</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="flex gap-1 items-center">
                  <FontAwesomeIcon size='xs' icon={getIcon(ativo.rentabilidade)} className={`${getColorClass(ativo.rentabilidade)}`} />
                  <p className={`text-xs ${getColorClass(ativo.rentabilidade)}`}>{ativo.rentabilidade}</p>
                </div>
              </div>
            </div>
          </article>
        )
      })}

      <footer className="flex flex-col bg-gray-100 p-4 rounded-lg">
        <p className="text-base">Visão geral</p>
        <div className="flex justify-between">
          <small className="text-gray-600">Média de rendimento</small>
          <small className="text-gray-600 font-medium">
            {corretoras.length > 0
              ? (corretoras.reduce((total, a) => total + parseFloat(a.rentabilidade.replace('%', '').replace(',', '.')), 0) / corretoras.length).toFixed(2).replace('.', ',') + '%'
              : '0%'}
          </small>
        </div>
        <div className="flex justify-between">
          <small className="text-gray-600">Total investido</small>
          <small className="text-gray-600 font-medium">{formatValue(corretoras.reduce((total, a) => total + a.valor, 0))}</small>
        </div>
      </footer>
    </section>
  )
}