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
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

import Loading from '../../../../shared/Loading/Loading'
import AtivosNaoAtivos from './components/ativosNaoAtivos';

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

const API_URL = import.meta.env.VITE_API_URL;

type PatrimonioEvolucaoItem = {
  ano: number;
  valor: number;
};

type PatrimonioDetalhe = {
  ativos?: Array<Record<string, any>>;
  naoAtivos?: Array<Record<string, any>>;
  evolucao?: PatrimonioEvolucaoItem[];
};

const normalizePatrimonioPayload = (data: unknown): PatrimonioDetalhe => {
  const payload = Array.isArray(data) ? data[0] : data;
  return payload && typeof payload === 'object' ? (payload as PatrimonioDetalhe) : {};
};

export default function Patrimonio({ className }: { className?: string }) {
  const [patrimonio, setPatrimonio] = useState<PatrimonioEvolucaoItem[]>([]);
  const [ativos, setAtivos] = useState<Array<Record<string, any>>>([]);
  const [naoAtivos, setNaoAtivos] = useState<Array<Record<string, any>>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/patrimonio`);
      const payload = normalizePatrimonioPayload(await response.json());
  
      const { evolucao, ativos, naoAtivos } = payload;

      setPatrimonio(Array.isArray(evolucao) ? evolucao : []);
      setAtivos(Array.isArray(ativos) ? ativos : []);
      setNaoAtivos(Array.isArray(naoAtivos) ? naoAtivos : []);
    } catch (error) {
      console.error('Erro ao buscar dados do patrimônio:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const patrimonioOrdenado = useMemo(
    () => [...patrimonio].sort((a, b) => a.ano - b.ano),
    [patrimonio]
  );

  const labels = patrimonioOrdenado.map((p) => {
    return p.ano?.toString();
  });

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
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
    <>
      <Loading isLoading={isLoading} message="Carregando patrimônio..." />
      
      <h1 className="text-2xl font-bold mb-4">Patrimônio</h1>

      <AtivosNaoAtivos
        ativos={ativos}
        title="Ativos"
        iconColor="bg-green-500" />

      <AtivosNaoAtivos
        ativos={naoAtivos}
        title="Não ativos"
        iconColor="bg-yellow-500" />

      <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
        <p className="text-lg">Evolução do patrimônio</p>

        <Line data={data} options={options} />
      </section>
    </>
  )
}