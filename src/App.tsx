
import './App.css'
import AtivosNaoAtivos from './components/AtivosNaoAtivos.js'
import CorretorasInvestimentos from './components/CorretorasInvestimentos.js'
import PerfilInvestimentos from './components/perfilInvestimentos.js'

function App() {
  const ativos = [
    {
      ano: 2026,
      'salário': 13878.24,
      'contas a receber': 415.38,
      investimentos: 200000.00,
      'Reserva de emergência': 32123.85,
    }
  ]

  const naoAtivos = [
    {
      ano: 2026,
      'veículos': 7335.00,
      'imóveis': 0.00,
      FGTS: 55448.70,
      'objetos de valor': 10000.00,
      outros: 0.00,
    }
  ]

  const corretoras = [
    {
      nome: 'XP',
      ativos: 73,
      variacao: '37,87%',
      valor: 78419.11,
    },
    {
      nome: 'Rico',
      ativos: 37,
      variacao: '37,87%',
      valor: 84885.40,
    },
    {
      nome: 'NU',
      ativos: 23,
      variacao: '37,87%',
      valor: 11367.95,
    },
    {
      nome: 'Inter',
      ativos: 7,
      variacao: '37,87%',
      valor: 1358.54,
    },
  ]

  return (
    <div className='bg-gray-100 m-4 p-4'>
      <AtivosNaoAtivos ativos={ativos} className="mb-4" title="Ativos" />
      <AtivosNaoAtivos ativos={naoAtivos} className="mb-4" title="Não ativos" />
      <PerfilInvestimentos className="mb-4" />
      <CorretorasInvestimentos corretoras={corretoras} />
    </div>
  )
}

export default App
