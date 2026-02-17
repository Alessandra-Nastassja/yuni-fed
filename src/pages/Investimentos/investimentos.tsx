import Patrimonio from "./components/Patrimonio/patrimonio";
import Carteira from "./components/Carteira/carteira";
import Corretoras from "./components/Corretoras/corretoras";
import MetasList from "./components/MetasList/metasList";

export default function Investimentos({ corretoras, perfil, metas }: { corretoras?: any[], perfil?: any, metas?: any[] }) {
  
  return (
    <main className='p-4 space-y-4'>
      <Patrimonio />

      <MetasList metas={metas} />
      {/* <Carteira perfil={perfil} />
      <Corretoras corretoras={corretoras} /> */}
    </main>
  )
}