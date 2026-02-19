import { useState, useEffect, useMemo } from "react";

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

import { useAlert } from "../../shared/Alert/AlertContext";
import Loading from "../../shared/Loading/Loading";

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
  evolucao?: PatrimonioEvolucaoItem[];
};

const normalizePatrimonioPayload = (data: unknown): PatrimonioDetalhe => {
  const payload = Array.isArray(data) ? data[0] : data;
  return payload && typeof payload === 'object' ? (payload as PatrimonioDetalhe) : {};
};

export default function Patrimonio() {

  const { showAlert } = useAlert();
  const [patrimonio, setPatrimonio] = useState<PatrimonioEvolucaoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/patrimonio`);
      const payload = normalizePatrimonioPayload(await response.json());
  
      const { evolucao } = payload;

      setPatrimonio(Array.isArray(evolucao) ? evolucao : []);
    } catch (error) {
      showAlert('Erro ao carregar dados do patrimônio.', 'error');
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
    <main className='m-4 p-4 space-y-4'>
      <Loading isLoading={isLoading} message="Carregando patrimônio..." />
      <h1 className="text-2xl font-bold mb-4">Patrimônio</h1>

      {/* <AtivosList /> */}

      <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg`}>
        <p className="text-lg">Evolução do patrimônio</p>

        <Line data={data} options={options} />
      </section>
    </main>
  )
}