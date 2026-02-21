import { useState, useEffect } from "react";

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
import AtivosList from "./components/Ativos/ativosList";
import NaoAtivosList from "./components/NaoAtivos/naoAtivosList";

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

type Ativo = {
  id: number;
  nome: string;
  tipo: string;
  valorAtual: number;
};

export default function Patrimonio() {

  const { showAlert } = useAlert();
  const [ativosTotal, setAtivosTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const naoAtivosTotal = 10000; // TODO: buscar valor total de ativos não-investimento do backend para mostrar no gráfico junto com o total de investimentos (ex: imóveis, veículos, etc) - para isso, adicionar campo "subtipo" ou similar no backend para diferenciar os tipos de investimento e permitir somar os valores separadamente
  
  const fetchAtivos = async () => {
    try {
      const response = await fetch(`${API_URL}/ativos`);
      const { ativos } = await response.json();
      
      if (Array.isArray(ativos)) {
        const total = ativos.reduce((acc: number, ativo: Ativo) => acc + ativo.valorAtual, 0);
        setAtivosTotal(total);
      }
    } catch (error) {
      showAlert('Erro ao buscar ativos.', 'error');
    }
  };
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      await fetchAtivos();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const labels = ['Ativos Atual'];

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
        label: `(R$) Total de Ativos: ${ativosTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        data: [ativosTotal],
        borderColor: 'rgb(75, 192, 75)',
        backgroundColor: 'rgba(75, 192, 75, 0.5)',
      },
      {
        fill: true,
        label: `(R$) Total de Ativos Não-Investimento: ${naoAtivosTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        data: [naoAtivosTotal],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <main className='m-4 p-4 space-y-4'>
      <Loading isLoading={isLoading} message="Carregando patrimônio..." />
      
      <AtivosList title="Ativos" iconColor="bg-green-500" />
      <NaoAtivosList title="Não Ativos" iconColor="bg-red-500" />

      <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg`}>
        <p className="text-lg">Evolução do patrimônio</p>

        <Line data={data} options={options} />
      </section>
    </main>
  )
}