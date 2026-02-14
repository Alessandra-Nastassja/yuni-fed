import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PerfilInvestimentos({ className }: { className?: string }) {
  const data = {
    labels: ['Conservador', 'Moderado', 'Agressivo'],
    datasets: [
      {
        label: 'Valor investido',
        data: [19547.24,  206388.59, 1966.52],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <p className="text-lg">Meu perfil de investidor</p>

      <Doughnut data={data} />

      <article className="flex flex-col gap-1">
        <div className="flex justify-between">
          <p>Conservador</p>
          <p className="font-medium">R$ 19.547,24</p>
        </div>

        <div className="flex justify-between">
          <p>Moderado</p>
          <p className="font-medium">R$ 206.388,59</p>
        </div>

        <div className="flex justify-between">
          <p>Agressivo</p>
          <p className="font-medium">R$ 1.966,52</p>
        </div>
      </article>

      <footer className="flex flex-row justify-between mt-2 bg-gray-100 p-4 rounded-lg items-center">
        <p className="font-medium">Total</p>
        <small className="text-gray-600 font-medium">R$ 227.892,35</small>
      </footer>
    </section>
  )
}