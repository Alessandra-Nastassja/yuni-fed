
import './App.css'
import AtivosNaoAtivos from './components/AtivosNaoAtivos.js'
import CorretorasInvestimentos from './components/CorretorasInvestimentos.js'
import PerfilInvestimentos from './components/perfilInvestimentos.js'

function App() {
  const ativos = [
    {
      ano: 2026,
      'Conta corrente': 0.00,
      'salário': 13878.24,
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
      rentabilidade: '37,87%',
      valor: 78419.11,
    },
    {
      nome: 'Rico',
      ativos: 37,
      rentabilidade: '37,87%',
      valor: 84885.40,
    },
    {
      nome: 'NU',
      ativos: 23,
      rentabilidade: '37,87%',
      valor: 11367.95,
    },
    {
      nome: 'Inter',
      ativos: 7,
      rentabilidade: '37,87%',
      valor: 1358.54,
    },
  ]

  const perfil = [
    {
      nome: 'Conservador',
      valor: 19547.24,
    },
    {
      nome: 'Moderado',
      valor: 206388.59,
    },
    {
      nome: 'Agressivo',
      valor: 1966.52,
    },
  ]

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
