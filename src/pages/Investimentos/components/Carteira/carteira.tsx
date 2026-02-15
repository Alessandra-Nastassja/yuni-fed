import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import formatValue from '../../../../utils/formatValue';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Carteira(
  { perfil, className }: { perfil: any[], className?: string }) {

  const data = {
    labels: perfil.map((c) => c.nome),
    datasets: [
      {
        label: 'Valor investido',
        data: perfil.map((c) => c.valor),
        backgroundColor: [
          'rgba(74, 222, 128, 0.8)',
          'rgba(22, 163, 74, 0.8)',
          'rgba(6, 78, 59, 0.8)',
        ],
        borderColor: [
          'rgba(74, 222, 128, 1)',
          'rgba(22, 163, 74, 1)',
          'rgba(6, 78, 59, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <p className="text-lg">Meus investimentos</p>

      <Pie data={data} />

      {perfil.map((ativo) => {
        const percentual = perfil.reduce((total, a) => total + a.valor, 0) > 0 ? (ativo.valor / perfil.reduce((total, a) => total + a.valor, 0)) * 100 : 0
        const percentualStr = percentual.toFixed(0).replace('.', ',') + '%'

        return (
          <div key={ativo.nome} className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="font-medium">{ativo.nome}</p>
              
              <div className="flex flex-row items-end">
                <p className="font-medium">{formatValue(ativo.valor)}</p>
                {/* <small className="text-gray-600">({percentualStr})</small> */}
              </div>
            </div>
            {ativo.distribuicao && (
              <div className="space-y-1 pl-4">
                {Object.entries(ativo.distribuicao)
                  .filter(([_, valor]) => (valor as number) > 0)
                  .map(([nome, valor]) => (
                    <div key={nome} className="flex justify-between text-sm text-gray-600">
                      <span>{nome}</span>
                      <span>{formatValue(valor as number)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )
      })}

      <footer className="flex flex-row justify-between mt-2 bg-gray-100 p-4 rounded-lg items-center">
        <p className="font-medium">Total</p>
        <small className="text-gray-600 font-medium">R$ 227.892,35</small>
      </footer>
    </section>
  )
}