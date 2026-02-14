export default function AtivosNaoAtivos({ className }: { className?: string }) {
  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <p className="text-lg">Ativos vs Não Ativos</p>

      <article className="flex flex-col gap-1">
        <p className="font-medium">2026</p>
        <div className="flex justify-between">
          <p>Salário</p>
          <p className="font-medium">R$ 13.878,24</p>
        </div>

        <div className="flex justify-between">
          <p>Contas á receber</p>
          <p className="font-medium">R$ 415,38</p>
        </div>

        <div className="flex justify-between">
          <p>Investimentos</p>
          <p className="font-medium">R$ 200.000,00</p>
        </div>

        <div className="flex justify-between">
          <p>Reserva de emergência</p>
          <p className="font-medium">R$ 32.123,85</p>
        </div>
      </article>
    </section>
  );
};