import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import formatValue from '../utils/formatValue';

ChartJS.register(ArcElement, Tooltip, Legend);

const getClassificationColor = (classificacao: string) => {
  switch (classificacao) {
    case 'Conservador':
      return 'bg-green-100 text-green-800';
    case 'Moderado':
      return 'bg-yellow-100 text-yellow-800';
    case 'Agressivo':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function DistribuicaoCarteira({ distribuicao, className }: { distribuicao?: any[], className?: string }) {
  const allItems = distribuicao || [];
  const items = allItems.filter(item => item.valor > 0);

  const data = {
    labels: items.map((c) => c.nome),
    datasets: [
      {
        label: 'Valor',
        data: items.map((c) => c.valor),
        backgroundColor: [
          'rgba(74, 222, 128, 0.8)',
          'rgba(22, 163, 74, 0.8)',
          'rgba(6, 78, 59, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(5, 150, 105, 0.8)',
          'rgba(4, 120, 87, 0.8)',
        ],
        borderColor: [
          'rgba(74, 222, 128, 1)',
          'rgba(22, 163, 74, 1)',
          'rgba(6, 78, 59, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(5, 150, 105, 1)',
          'rgba(4, 120, 87, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className || ''}`}>
      <p className="text-lg">Distribuição da carteira</p>

      <Pie data={data} />

      {items.map((item) => {
        const percentual = total > 0 ? (item.valor / total) * 100 : 0;
        const percentualStr = percentual.toFixed(2).replace('.', ',') + '%';

        return (
          <article key={item.nome} className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p>{item.nome}</p>
              <span className={`text-xs px-2 py-1 rounded w-fit ${getClassificationColor(item.classificacao)}`}>
                {item.classificacao}
              </span>
            </div>
            <div className='flex flex-col items-end'>
              <p className="font-medium">{formatValue(item.valor)}</p>
              <small className="text-xs text-gray-500">{percentualStr}</small>
            </div>
          </article>
        );
      })}

      <footer className="flex flex-row justify-between mt-2 bg-gray-100 p-4 rounded-lg items-center">
        <p className="font-medium">Total</p>
        <small className="text-gray-600 font-medium">{formatValue(total)}</small>
      </footer>
    </section>
  );
}