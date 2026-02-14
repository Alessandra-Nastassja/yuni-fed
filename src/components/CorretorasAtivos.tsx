export default function CorretorasAtivos() {
  const ativos = [
    {
      nome: 'XP Investimentos',
      ativos: 73,
      variacao: '37,87%',
    },
    {
      nome: 'Rico',
      ativos: 37,
      variacao: '37,87%',
    },
    {
      nome: 'NU Investimentos',
      ativos: 23,
      variacao: '37,87%',
    },
    {
      nome: 'Inter',
      ativos: 7,
      variacao: '37,87%',
    },
  ]

  const totalAtivos = ativos.reduce((total, a) => total + a.ativos, 0)

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg">
      <p className="text-lg">Corretoras vs Ativos</p>

      {ativos.map((ativo) => {
        const percentual = totalAtivos > 0 ? (ativo.ativos / totalAtivos) * 100 : 0
        const percentualStr = percentual.toFixed(2).replace('.', ',') + '%'

        return (
          <div key={ativo.nome}>
            <p className="font-medium">{ativo.nome}</p>
            <div className="flex gap-2 justify-between">
              <p>Ativos</p>
              <p className="font-medium">{ativo.ativos}</p>
            </div>
            {/* <div className="flex gap-2 justify-between">
              <p>Variação</p>
              <p className="font-medium">{ativo.variacao}</p>
            </div> */}
            <div className="flex gap-2 justify-between">
              <p>% na carteira</p>
              <p className="font-medium">{percentualStr}</p>
            </div>
          </div>
        )
      })}

      <div className="flex flex-col mt-5 bg-gray-100 p-4 rounded-lg">
        <p className="font-medium">Total</p>
        <div className="flex justify-between">
          <small className="text-gray-600">Ativos</small>
          <small className="text-gray-600 font-medium">{totalAtivos}</small>
        </div>
      </div>
    </div>
  )
}