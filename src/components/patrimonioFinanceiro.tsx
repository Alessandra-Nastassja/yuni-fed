import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function PatrimonioFinanceiro({ className, patrimonio }: { className?: string, patrimonio: any[] }) {
  const patrimonioOrdenado = [...patrimonio].sort(
    (a, b) => a.ano - b.ano
  );

  const labels = patrimonioOrdenado.map((p) => p.ano.toString());

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 250000,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: '(R$) Ativos + Não ativos',
        data: patrimonioOrdenado.map((p) => p.valor),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <p className="text-lg">Evolução do patrimônio</p>

      <Line data={data} options={options} />
    </section>
  )
}