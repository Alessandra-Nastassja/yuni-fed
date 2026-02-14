export default function AtivosNaoAtivos({ className }: { className?: string }) {
  const ativos = [
    {
      ano: 2026,
      salario: 13878.24,
      contasReceber: 415.38,
      investimentos: 200000.00,
      reservaEmergencia: 32123.85,
    }
  ]

  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <p className="text-lg">Ativos vs Não Ativos</p>

      {ativos.map((ativo) => (
        <article className="flex flex-col gap-1">
          <p className="font-medium">{ativo.ano}</p>
          <div className="flex justify-between">
            <p>Salário</p>
            <p className="font-medium">R$ {ativo.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="flex justify-between">
            <p>Contas á receber</p>
            <p className="font-medium">R$ {ativo.contasReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} </p>
          </div>

          <div className="flex justify-between">
            <p>Investimentos</p>
            <p className="font-medium">R$ {ativo.investimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="flex justify-between">
            <p>Reserva de emergência</p>
            <p className="font-medium">R$ {ativo.reservaEmergencia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}   </p>
          </div>
        </article>
      ))}
    </section>
  );
};