export default function Ativos() {
  


  return (
    <div className="flex flex-col gap-4 p-4">
      <p>Corretoras vs Ativos</p>
      <div className="flex flex-col justify-around gap-4">
        <p className="font-bold">XP Investimentos</p>
        <div className="flex gap-2 justify-between">
          <p>Ativos</p>
          <p className="font-bold">37</p>
        </div>
        <div className="flex gap-2 justify-between">
          <p>Variação</p>
          <p className="font-bold">37,87%</p>
        </div>
        <div className="flex gap-2 justify-between">
          <p>% na carteira</p>
          <p className="font-bold">37,87%</p>
        </div>
      </div>
    </div>
  )
}