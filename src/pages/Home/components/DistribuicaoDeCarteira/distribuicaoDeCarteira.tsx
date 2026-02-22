import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatValue } from '@utils/currency';
import { useEffect, useState } from 'react';
import Badge from '@shared/Badge/Badge';

ChartJS.register(ArcElement, Tooltip, Legend);


interface ItemDistribuicao {
  nome: string;
  valor: number;
  classificacao: string;
  tipo: string;
}

interface CategoriaInvestimento {
  tipo: string;
  classificacao: string;
}

const getColorByType = (tipo: string, classificacao: string): string => {
  // Renda Variável Agressivo → Vermelho
  if (tipo === 'Renda Variável' && classificacao === 'Agressivo') {
    return 'bg-red-100 text-red-800';
  }
  
  // Renda Fixa Moderado → Amarelo
  if (tipo === 'Renda Fixa' && classificacao === 'Moderado') {
    return 'bg-yellow-100 text-yellow-800';
  }
  
  // Tesouro Direto → Verde (sempre conservador)
  if (tipo === 'Tesouro Direto') {
    return 'bg-green-100 text-green-800';
  }
  
  // Fallback para classificação
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

const getChartColorByType = (tipo: string, classificacao: string, opacity: number = 0.8): { bgColor: string; borderColor: string } => {
  // Renda Variável Agressivo → Vermelho
  if (tipo === 'Renda Variável' && classificacao === 'Agressivo') {
    return {
      bgColor: `rgba(239, 68, 68, ${opacity})`,
      borderColor: `rgba(239, 68, 68, 1)`,
    };
  }
  
  // Renda Fixa Moderado → Amarelo
  if (tipo === 'Renda Fixa' && classificacao === 'Moderado') {
    return {
      bgColor: `rgba(250, 204, 21, ${opacity})`,
      borderColor: `rgba(250, 204, 21, 1)`,
    };
  }
  
  // Tesouro Direto → Verde (Conservador)
  if (tipo === 'Tesouro Direto') {
    return {
      bgColor: `rgba(34, 197, 94, ${opacity})`,
      borderColor: `rgba(34, 197, 94, 1)`,
    };
  }
  
  // Fallback
  return {
    bgColor: `rgba(107, 114, 128, ${opacity})`,
    borderColor: `rgba(34, 197, 94, 1)`,
  };
};

// Padrões para categorização de investimentos
const INVESTMENT_PATTERNS: Array<{
  keywords?: string[];
  regex?: RegExp;
  categoria: CategoriaInvestimento;
}> = [
  {
    keywords: ['TESOURO'],
    categoria: { tipo: 'Tesouro Direto', classificacao: 'Conservador' },
  },
  {
    keywords: ['CDB'],
    categoria: { tipo: 'Renda Fixa', classificacao: 'Conservador' },
  },
  {
    keywords: ['FIC', 'FIM'],
    categoria: { tipo: 'Renda Fixa', classificacao: 'Moderado' },
  },
  {
    keywords: ['FII'],
    regex: /^[A-Z]{4}11/,
    categoria: { tipo: 'Renda Variável', classificacao: 'Moderado' },
  },
  {
    keywords: ['ETF', 'ISHARES', 'FUND'],
    categoria: { tipo: 'Renda Variável', classificacao: 'Agressivo' },
  },
  {
    regex: /^[A-Z]{4}\d{1,2}$/,
    categoria: { tipo: 'Renda Variável', classificacao: 'Agressivo' },
  },
];

const categorizeInvestimento = (nome: string): CategoriaInvestimento => {
  const upperNome = nome.toUpperCase();

  for (const pattern of INVESTMENT_PATTERNS) {
    if (pattern.keywords) {
      if (pattern.keywords.some(keyword => upperNome.includes(keyword))) {
        return pattern.categoria;
      }
    }

    if (pattern.regex && pattern.regex.test(upperNome)) {
      return pattern.categoria;
    }
  }

  return { tipo: 'Renda Variável', classificacao: 'Agressivo' };
};

const AGGRESSIVENESS_ORDER: { [key: string]: number } = {
  'Agressivo': 3,
  'Moderado': 2,
  'Conservador': 1,
};

const getMoreAggressiveClassification = (current: string, newOne: string): string => {
  const currentLevel = AGGRESSIVENESS_ORDER[current] || 0;
  const newLevel = AGGRESSIVENESS_ORDER[newOne] || 0;
  return newLevel > currentLevel ? newOne : current;
};

const groupInvestmentsByType = (investimentos: any[]): ItemDistribuicao[] => {
  const tipoMap: { [key: string]: { nome: string; valor: number; classificacao: string; tipo: string } } = {};

  investimentos.forEach((ativo: any) => {
    const categoria = categorizeInvestimento(ativo.nome);
    
    if (!tipoMap[categoria.tipo]) {
      tipoMap[categoria.tipo] = {
        nome: categoria.tipo,
        valor: 0,
        classificacao: categoria.classificacao,
        tipo: categoria.tipo,
      };
    } else {
      // Se já existe, usa a classificação mais agressiva
      tipoMap[categoria.tipo].classificacao = getMoreAggressiveClassification(
        tipoMap[categoria.tipo].classificacao,
        categoria.classificacao
      );
    }
    tipoMap[categoria.tipo].valor += ativo.valorAtual || 0;
  });

  return Object.values(tipoMap).filter(item => item.valor > 0);
};

export default function DistribuicaoDeCarteira({ 
  distribuicao, 
  className 
}: { 
  distribuicao?: ItemDistribuicao[]; 
  className?: string;
}) {
  const [investimentosData, setInvestimentosData] = useState<ItemDistribuicao[]>([]);

  useEffect(() => {
    const fetchInvestimentos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ativos/completo`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const ativos = await response.json();
        
        const investimentos = ativos.filter((ativo: any) => ativo.tipo === 'investimentos');
        const processedItems = groupInvestmentsByType(investimentos);
        
        setInvestimentosData(processedItems);
      } catch (error) {
        console.error('Erro ao buscar investimentos:', error);
        setInvestimentosData([]);
      }
    };

    fetchInvestimentos();
  }, []);

  const allItems = distribuicao || investimentosData;
  const items = allItems.filter(item => item.valor > 0);

  const backgroundColor = items.map((item) => getChartColorByType(item.tipo, item.classificacao, 0.8).bgColor);
  const borderColor = items.map((item) => getChartColorByType(item.tipo, item.classificacao, 1).borderColor);

  const data = {
    labels: items.map((c) => c.nome),
    datasets: [
      {
        label: 'Valor',
        data: items.map((c) => c.valor),
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <>
      <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className || ''}`}>
        <p className="text-lg">Distribuição de Carteira</p>

        {items.length > 0 ? (
          <>
            <div className="flex justify-center">
              <Pie data={data} options={options} />
            </div>

            {items.map((item) => {
              const percentual = total > 0 ? (item.valor / total) * 100 : 0;
              const percentualStr = percentual.toFixed(2).replace('.', ',') + '%';

              return (
                <article key={item.nome} className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <p>{item.nome}</p>
                    <Badge 
                      label={item.classificacao}
                      className={getColorByType(item.tipo, item.classificacao)}
                    />
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
          </>
        ) : (
          <div className="flex items-center justify-center text-gray-500">
            <p className="text-sm">Nenhum item para exibir</p>
          </div>
        )}
      </section>
    </>
  );
}