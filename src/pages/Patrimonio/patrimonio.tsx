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
  dataCriacao: string;
};

type NaoAtivo = {
  id: number;
  nome?: string;
  tipo: string;
  valorAtual: number;
  dataCompra: string;
};

type PatrimonioData = {
  data: string;
  ativos: number;
  naoAtivos: number;
};

type EventoPatrimonio = {
  data: Date;
  tipo: 'ativo' | 'naoAtivo';
  valor: number;
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
      
      // Montar linha do tempo de eventos e acumular por dia
      const eventos: EventoPatrimonio[] = [];

      if (Array.isArray(ativos)) {
        ativos.forEach((ativo: Ativo) => {
          const data = new Date(ativo.dataCriacao);
          if (!Number.isNaN(data.getTime())) {
            eventos.push({ data, tipo: 'ativo', valor: Number(ativo.valorAtual) || 0 });
          }
        });
      }

      if (Array.isArray(naoAtivos)) {
        naoAtivos.forEach((naoAtivo: NaoAtivo) => {
          const data = new Date(naoAtivo.dataCompra);
          if (!Number.isNaN(data.getTime())) {
            eventos.push({ data, tipo: 'naoAtivo', valor: Number(naoAtivo.valorAtual) || 0 });
          }
        });
      }

      eventos.sort((a, b) => a.data.getTime() - b.data.getTime());

      if (eventos.length === 0) {
        setPatrimonioData([{ data: new Date().toISOString().slice(0, 10), ativos: 0, naoAtivos: 0 }]);
        return;
      }

      const valoresPorDia = new Map<string, { ativos: number; naoAtivos: number }>();

      eventos.forEach((evento) => {
        const chaveDia = evento.data.toISOString().slice(0, 10);
        if (!valoresPorDia.has(chaveDia)) {
          valoresPorDia.set(chaveDia, { ativos: 0, naoAtivos: 0 });
        }

        const valorDia = valoresPorDia.get(chaveDia)!;
        if (evento.tipo === 'ativo') {
          valorDia.ativos += evento.valor;
        } else {
          valorDia.naoAtivos += evento.valor;
        }
      });

      let ativosAcumulado = 0;
      let naoAtivosAcumulado = 0;

      const dadosAcumulados: PatrimonioData[] = Array.from(valoresPorDia.entries())
        .sort(([dataA], [dataB]) => dataA.localeCompare(dataB))
        .map(([data, valores]) => {
        ativosAcumulado += valores.ativos;
        naoAtivosAcumulado += valores.naoAtivos;

        return {
          data,
          ativos: ativosAcumulado,
          naoAtivos: naoAtivosAcumulado,
        };
      });
      
      setPatrimonioData(dadosAcumulados);
      
    } catch (error) {
      showAlert('Erro ao buscar dados do patrimônio.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const anosPresentes = new Set(
    patrimonioData.map((d) => new Date(`${d.data}T00:00:00`).getFullYear())
  );

  // Preparar dados para o gráfico
  const labels = patrimonioData.length > 0 
    ? patrimonioData.map((d) => {
        const data = new Date(`${d.data}T00:00:00`);
        return data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          ...(anosPresentes.size > 1 ? { year: '2-digit' as const } : {}),
        });
      })
    : ['Atual'];
  
  const ativosData = patrimonioData.length > 0
    ? patrimonioData.map(d => d.ativos)
    : [0];
    
  const naoAtivosData = patrimonioData.length > 0
    ? patrimonioData.map(d => d.naoAtivos)
    : [0];

  const totalData = patrimonioData.length > 0
    ? patrimonioData.map(d => d.ativos + d.naoAtivos)
    : [0];
  
  const ativosTotal = patrimonioData.length > 0 
    ? patrimonioData[patrimonioData.length - 1].ativos 
    : 0;
    
  const naoAtivosTotal = patrimonioData.length > 0 
    ? patrimonioData[patrimonioData.length - 1].naoAtivos 
    : 0;

  const patrimonioTotal = ativosTotal + naoAtivosTotal;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        min: 0,
        ticks: {
          callback: function(value: number | string) {
            const numero = typeof value === 'string' ? Number(value) : value;
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0,
            }).format(numero);
          },
        },
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
        label: `Ativos (${ativosTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`,
        data: ativosData,
        borderColor: 'rgb(75, 192, 75)',
        backgroundColor: 'rgba(75, 192, 75, 0.5)',
      },
      {
        fill: true,
        label: `Não Ativos (${naoAtivosTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`,
        data: naoAtivosData,
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
      },
      {
        fill: false,
        label: `Total (${patrimonioTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`,
        data: totalData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        borderDash: [8, 6],
        pointRadius: 2,
        pointHoverRadius: 4,
        tension: 0.2,
      },
    ],
  };

  return (
    <main className='m-4 p-4 space-y-4'>
      <Loading isLoading={isLoading} message="Carregando patrimônio..." />
      
      <AtivosList title="Ativos" iconColor="bg-green-500" />
      <NaoAtivosList title="Não Ativos" iconColor="bg-yellow-500" />

      <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg`}>
        <p className="text-lg">Evolução do patrimônio</p>

        {patrimonioData.length > 0 ? (
          <div className="h-56 sm:h-64">
            <Line data={data} options={options} />
          </div>
        ) : (
          <div className="flex items-center justify-center text-gray-500">
            <p className="text-sm">Nenhum dado para exibir</p>
          </div>
        )}
      </section>
    </main>
  )
}