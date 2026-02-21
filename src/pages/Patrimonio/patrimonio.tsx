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
  createdAt: string;
};

type NaoAtivo = {
  id: number;
  nome?: string;
  tipo: string;
  valorAtual: number;
  createdAt: string;
};

type PatrimonioData = {
  ano: number;
  ativos: number;
  naoAtivos: number;
};

export default function Patrimonio() {

  const { showAlert } = useAlert();
  const [patrimonioData, setPatrimonioData] = useState<PatrimonioData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Buscar ativos e não ativos em paralelo
      const [ativosResponse, naoAtivosResponse] = await Promise.all([
        fetch(`${API_URL}/ativos`),
        fetch(`${API_URL}/nao-ativos`)
      ]);
      
      const { ativos } = await ativosResponse.json();
      const { naoAtivos } = await naoAtivosResponse.json();
      
      // Se não há dados com createdAt válidos, usar ano atual como snapshot
      const anoAtual = new Date().getFullYear();
      
      // Calcular totais
      let totalAtivos = 0;
      let totalNaoAtivos = 0;
      
      if (Array.isArray(ativos)) {
        totalAtivos = ativos.reduce((acc: number, ativo: Ativo) => acc + ativo.valorAtual, 0);
      }
      
      if (Array.isArray(naoAtivos)) {
        totalNaoAtivos = naoAtivos.reduce((acc: number, naoAtivo: NaoAtivo) => acc + naoAtivo.valorAtual, 0);
      }
      
      // Criar snapshot do ano atual
      const dadosSnapshot: PatrimonioData[] = [{
        ano: anoAtual,
        ativos: totalAtivos,
        naoAtivos: totalNaoAtivos,
      }];
      
      setPatrimonioData(dadosSnapshot);
      
    } catch (error) {
      showAlert('Erro ao buscar dados do patrimônio.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Preparar dados para o gráfico
  const labels = patrimonioData.length > 0 
    ? patrimonioData.map(d => d.ano.toString())
    : ['Atual'];
  
  const ativosData = patrimonioData.length > 0
    ? patrimonioData.map(d => d.ativos)
    : [0];
    
  const naoAtivosData = patrimonioData.length > 0
    ? patrimonioData.map(d => d.naoAtivos)
    : [0];
  
  const ativosTotal = patrimonioData.length > 0 
    ? patrimonioData[patrimonioData.length - 1].ativos 
    : 0;
    
  const naoAtivosTotal = patrimonioData.length > 0 
    ? patrimonioData[patrimonioData.length - 1].naoAtivos 
    : 0;

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: `Total de Ativos: ${ativosTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        data: ativosData,
        borderColor: 'rgb(75, 192, 75)',
        backgroundColor: 'rgba(75, 192, 75, 0.5)',
      },
      {
        fill: true,
        label: `Total de Não Ativos: ${naoAtivosTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        data: naoAtivosData,
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