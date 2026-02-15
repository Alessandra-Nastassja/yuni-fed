import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatValue } from '../utils/formatValue'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function CorretorasInvestimentos({ corretoras = [] }: { corretoras?: any[] }) {
  const totalInvestimentos = corretoras.reduce((total, a) => total + a.ativos, 0)
  const SELIC = 15

  // Calcular a mediana das rentabilidades
  const rentabilidades = corretoras.map((c) =>
    parseFloat(c.rentabilidade.replace('%', '').replace(',', '.'))
  ).sort((a, b) => a - b)
  const mediana = rentabilidades.length > 0
    ? rentabilidades.length % 2 === 0
      ? (rentabilidades[rentabilidades.length / 2 - 1] + rentabilidades[rentabilidades.length / 2]) / 2
      : rentabilidades[Math.floor(rentabilidades.length / 2)]
    : 0

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

  const chartData = {
    labels: corretoras.map((c) => c.nome),
    datasets: [
      {
        label: 'Valor investido (R$)',
        data: corretoras.map((c) => c.valor),
        backgroundColor: [
          'rgba(77, 167, 104, 0.8)',
          'rgba(45, 135, 78, 0.8)',
          'rgba(38, 135, 78, 0.8)',
          'rgba(0, 102, 51, 0.8)',
        ],
        borderColor: [
          'rgba(77, 167, 104, 1)',
          'rgba(45, 135, 78, 1)',
          'rgba(38, 135, 78, 1)',
          'rgba(0, 102, 51, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <section className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg">
      <p className="text-lg">Corretoras x Investimentos</p>

      {/* <Bar data={chartData} /> */}

      {corretoras.map((ativo) => {
        const percentual = totalInvestimentos > 0 ? (ativo.ativos / totalInvestimentos) * 100 : 0
        const percentualStr = percentual.toFixed(2).replace('.', ',') + '%'

        return (
          <article key={ativo.nome}>
            <p className="text-base font-semibold">{ativo.nome}</p>
            {/* <div className="flex gap-2 justify-between">
              <p>Investimentos</p>
              <p className="text-base">{ativo.ativos}</p>
            </div> */}
            <div className="flex gap-2 justify-between">
              <p>Rentabilidade</p>
              <div className="flex gap-1 items-center">
                <FontAwesomeIcon size='xs' icon={getIcon(ativo.rentabilidade)} className={`${getColorClass(ativo.rentabilidade)}`} />
                <p className={`text-base ${getColorClass(ativo.rentabilidade)}`}>{ativo.rentabilidade}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <p>Valor investido</p>
              <div className='flex flex-col items-end'>
                <p className="text-base">{formatValue(ativo.valor)}</p>
                <small className="text-xs text-gray-500">({percentualStr})</small>
              </div>
            </div>
          </article>
        )
      })}

      <footer className="flex flex-col mt-5 bg-gray-100 p-4 rounded-lg">
        <p className="text-base">Total</p>
        <div className="flex justify-between">
          <small className="text-gray-600">Média de rendimento</small>
          <small className="text-gray-600 font-medium">
            {corretoras.length > 0
              ? (corretoras.reduce((total, a) => total + parseFloat(a.rentabilidade.replace('%', '').replace(',', '.')), 0) / corretoras.length).toFixed(2).replace('.', ',') + '%'
              : '0%'}
          </small>
        </div>
        <div className="flex justify-between">
          <small className="text-gray-600">Valor total</small>
          <small className="text-gray-600 font-medium">{formatValue(corretoras.reduce((total, a) => total + a.valor, 0))}</small>
        </div>
      </footer>
    </section>
  )
}