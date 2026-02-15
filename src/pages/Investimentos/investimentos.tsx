import AtivosNaoAtivos from "./components/AtivosNaoAtivos/ativosNaoAtivos";
import Carteira from "./components/Carteira/carteira";
import Corretoras from "./components/Corretoras/corretoras";
import Metas from "./components/Metas/metas";
import Patrimonio from "./components/Patrimonio/patrimonio";

export default function Investimentos({ ativos, naoAtivos, corretoras, perfil, patrimonioFinanceiro, metas }: { ativos: any[], naoAtivos: any[], corretoras: any[], perfil: any, patrimonioFinanceiro: any[], metas: any[] }) {
  return (
    <section className='bg-gray-100 m-4 p-4 space-y-4'>
      <AtivosNaoAtivos
        ativos={ativos}
        title="Ativos"
        iconColor="bg-green-500" />

      <AtivosNaoAtivos
        ativos={naoAtivos}
        title="Não ativos"
        iconColor="bg-yellow-500" />

      <Patrimonio patrimonio={patrimonioFinanceiro} />
      <Carteira perfil={perfil} />
      <Metas metas={metas} />
      <Corretoras corretoras={corretoras} />
    </section>
  )
}