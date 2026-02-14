export default function Ativos() {
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
    <div className="flex flex-col gap-4 p-4">
      <p className="text-lg">Corretoras vs Ativos</p>

      {ativos.map((ativo) => {
        const percentual = totalAtivos > 0 ? (ativo.ativos / totalAtivos) * 100 : 0
        const percentualStr = percentual.toFixed(2).replace('.', ',') + '%'

        return (
          <div key={ativo.nome}>
            <p className="font-bold">{ativo.nome}</p>
            <div className="flex gap-2 justify-between">
              <p>Ativos</p>
              <p className="font-bold">{ativo.ativos}</p>
            </div>
            {/* <div className="flex gap-2 justify-between">
              <p>Variação</p>
              <p className="font-bold">{ativo.variacao}</p>
            </div> */}
            <div className="flex gap-2 justify-between">
              <p>% na carteira</p>
              <p className="font-bold">{percentualStr}</p>
            </div>
          </div>
        )
      })}

      <div className="flex gap-2 justify-between pt-4">
        <p className="font-bold">Total de ativos</p>
        <p>{totalAtivos}</p>
      </div>
    </div>
  )
}