
import './App.css'
import AtivosNaoAtivos from './components/AtivosNaoAtivos.js'
import CorretorasAtivos from './components/CorretorasAtivos.js'

function App() {
  const ativos = [
    {
      ano: 2026,
      salario: 13878.24,
      contasReceber: 415.38,
      investimentos: 200000.00,
      reservaEmergencia: 32123.85,
    }
  ]

  const naoAtivos = [
    {
      veiculos: 7335.00,
      imoveis: 0.00,
      FGTS: 55448.70,
      objetosValor: 10000.00,
      outros: 0.00,
    }
  ]

  return (
    <div className='bg-gray-100 m-4 p-4'>
      <AtivosNaoAtivos ativos={ativos} className="mb-4" title="Ativos" />
      <AtivosNaoAtivos ativos={naoAtivos} className="mb-4" title="Não ativos" />
      <CorretorasAtivos />
    </div>
  )
}

export default App
