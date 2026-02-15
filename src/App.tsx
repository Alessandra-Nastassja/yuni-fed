
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Investimentos from './components/Investimentos/investimentos'

function App() {
  const ativos = [
    {
      ano: 2026,
      'Conta corrente': 0.00,
      'Salário': {
        valor: 13878.24,
        descricao: 'Fonte de renda 1',
      },
      'Meu negócio': {
        valor: 0.00,
        descricao: 'Fonte de renda 2',
      },
      investimentos: 200000.00,
      'contas a receber': {
        valor: 415.38,
        descricao: 'Dividendos e JCP',
      },
      'Reserva de emergência': 32123.85,
      'Previdência privada': 0.00,
      'Outros': {
        valor: 0.00,
        descricao: '13 salário, férias, bônus, etc.',
      }
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
      nome: 'Inter',
      ativos: 7,
      rentabilidade: '9,00%',
      valor: 1358.54,
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
      nome: 'Caixa',
      ativos: 1,
      rentabilidade: '0,00%',
      valor: 0.00,
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
      nome: 'PagSeguro',
      ativos: 1,
      rentabilidade: '12,00%',
      valor: 1358.54,
      meta: 'Reserva de emergência',
    },
    {
      nome: 'PicPay',
      ativos: 1,
      rentabilidade: '12,00%',
      valor: 1358.54,
      meta: 'Reserva de emergência',
    },
    {
      nome: 'Wise',
      ativos: 1,
      rentabilidade: '12,00%',
      valor: 617.66,
      meta: 'Viagens',
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

  const patrimonioFinanceiro = [
    {
      ano: 2026,
      valor: 232123.85,
    },
    {
      ano: 2025,
      valor: 222448.47,
    },
    {
      ano: 2024,
      valor: 199276.15,
    },
    {
      ano: 2023,
      valor: 199276.15,
    },
    {
      ano: 2022,
      valor: 126141.67,
    },
    {
      ano: 2021,
      valor: 99470.32,
    },
    {
      ano: 2020,
      valor: 64501.39,
    },
  ]

  const metas = [
    {
      nome: 'Independência',
      valorMeta: 1000000.00,
      valorAtual: 232123.85,
      prazo: '2030',
    },
    {
      nome: 'Minha casa',
      valorMeta: 300000.00,
      valorAtual: 0.00,
      prazo: '2028',
    },
    {
      nome: 'Reforma da casa',
      valorMeta: 15000.00,
      valorAtual: 0.00,
      prazo: '2025',
    },
    {
      nome: 'Reserva de emergência',
      valorMeta: 32000.00,
      valorAtual: 232123.85,
      prazo: '2024',
    },
  ]

  return (
    <Routes>
      <Route path="/investimentos" element={
        <Investimentos
          ativos={ativos}
          naoAtivos={naoAtivos}
          corretoras={corretoras}
          perfil={perfil}
          patrimonioFinanceiro={patrimonioFinanceiro}
          metas={metas}
        />} />
    </Routes>
  )
}

export default App
