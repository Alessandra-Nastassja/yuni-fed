import Patrimonio from "./components/Patrimonio/patrimonio";
import Carteira from "./components/Carteira/carteira";
import Corretoras from "./components/Corretoras/corretoras";

export default function Investimentos({ corretoras, perfil }: { corretoras?: any[], perfil?: any }) {
  
  return (
    <main className='p-4 space-y-4'>
      <Patrimonio />
      {/* <Carteira perfil={perfil} />
      <Corretoras corretoras={corretoras} /> */}
    </main>
  )
}