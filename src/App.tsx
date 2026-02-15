
import './App.css'
import AtivosNaoAtivos from './components/AtivosNaoAtivos.js'
import CorretorasInvestimentos from './components/CorretorasInvestimentos.js'
import DistribuicaoCarteira from './components/DistribuicaoCarteira.js'
import PerfilInvestimentos from './components/perfilInvestimentos.js'

function App() {
  const ativos = [
    {
      ano: 2026,
      'Conta corrente': 0.00,
      'salário': {
        valor: 13878.24,
        descricao: 'Fonte de renda fixa',
      },
      'contas a receber': {
        valor: 415.38,
        descricao: 'Dividendos e JCP',
      },
      investimentos: 200000.00,
      'Reserva de emergência': 32123.85,
      'Previdência privada': 0.00,
    }
  ]

  const naoAtivos = [
    {
      ano: 2026,
      'veículos': 7335.00,
      'imóveis': 0.00,
      FGTS: 55448.70,
      'objetos de valor': {
        valor: 10000.00,
        descricao: 'Joias, obras de arte, etc.',
      },
      outros: {
        valor: 0.00,
        descricao: 'Qualquer outro ativo',
      },
    }
  ]

  const corretoras = [
    {
      nome: 'XP',
      ativos: 73,
      rentabilidade: '13,00%',
      valor: 78419.11,
      meta: 'Independência',
    },
    {
      nome: 'Rico',
      ativos: 37,
      rentabilidade: '13,52%',
      valor: 84885.40,
      meta: 'Minha casa',
    },
    {
      nome: 'NU',
      ativos: 23,
      rentabilidade: '11,95%',
      valor: 11367.95,
      meta: 'Reforma da casa',
    },
    {
      nome: 'Inter',
      ativos: 7,
      rentabilidade: '9,00%',
      valor: 1358.54,
      meta: 'Teste/Risco',
    },
  ]

  const perfil = [
    {
      nome: 'Conservador',
      valor: 219914.85, // 214924.30 + 4990.55
      distribuicao: {
        'Título Renda Fixa': 214924.30,
        'Tesouro Direto': 4990.55,
        'Fundo Renda Fixa / DI': 0.00,
        'Previdência Privada': 0.00,
      }
    },
    {
      nome: 'Moderado',
      valor: 344.96,
      distribuicao: {
        'ETF': 344.96,
        'Fundo Multimercado': 0.00,
        'FII': 0.00,
      }
    },
    {
      nome: 'Agressivo',
      valor: 1687.71,
      distribuicao: {
        'Ações': 1687.71,
        'Fundo Ações': 0.00,
        'COE': 0.00,
      }
    },
  ];

  return (
    <div className='bg-gray-100 m-4 p-4'>
      <AtivosNaoAtivos ativos={ativos} className="mb-4" title="Ativos" iconColor="bg-green-500" />
      <AtivosNaoAtivos ativos={naoAtivos} className="mb-4" title="Não ativos" iconColor="bg-yellow-500" />
      <PerfilInvestimentos perfil={perfil} className="mb-4" />
      <CorretorasInvestimentos corretoras={corretoras} />
    </div>
  )
}

export default App
