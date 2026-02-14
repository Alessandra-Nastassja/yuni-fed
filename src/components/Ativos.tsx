export default function Ativos() {
  const ativos = [
    {
      nome: 'XP Investimentos',
      ativos: 73,
      variacao: '37,87%',
      percentualCarteira: '37,87%',
    },
    {
      nome: 'Rico',
      ativos: 37,
      variacao: '37,87%',
      percentualCarteira: '37,87%',
    },
    {
      nome: 'NU Investimentos',
      ativos: 23,
      variacao: '37,87%',
      percentualCarteira: '37,87%',
    },
    {
      nome: 'Inter',
      ativos: 7,
      variacao: '37,87%',
      percentualCarteira: '37,87%',
    },
  ]

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-lg">Corretoras vs Ativos</p>

      {ativos.map((ativo) => (
        <div key={ativo.nome}>
          <p className="font-bold">{ativo.nome}</p>
          <div className="flex gap-2 justify-between">
            <p>Ativos</p>
            <p className="font-bold">{ativo.ativos}</p>
        </div>
        <div className="flex gap-2 justify-between">
          <p>Variação</p>
          <p className="font-bold">{ativo.variacao}</p>
        </div>
        <div className="flex gap-2 justify-between">
          <p>% na carteira</p>
          <p className="font-bold">{ativo.percentualCarteira}</p>
        </div>
      </div>  
      ))}

      <div className="flex gap-2 justify-between pt-4">
        <p className="font-bold">Total</p>
        <p>{ativos.reduce((total, ativo) => total + ativo.ativos, 0)}</p>
      </div>
    </div>
  )
}