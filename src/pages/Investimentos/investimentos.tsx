import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import AtivosNaoAtivos from "./components/AtivosNaoAtivos/ativosNaoAtivos";
import Carteira from "./components/Carteira/carteira";
import Corretoras from "./components/Corretoras/corretoras";
import Metas from "./components/Metas/metas";
import Patrimonio from "./components/Patrimonio/patrimonio";

export default function Investimentos({ ativos, naoAtivos, evolucao, corretoras, perfil, metas }: { ativos: any[], naoAtivos: any[], evolucao: any, corretoras?: any[], perfil?: any, metas?: any[] }) {
  
  return (
    <main className='m-4 p-4 space-y-4'>
      <header className="mb-8">
        <Link to="/" className="text-blue-600 hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} size='2xl' className='absolute top-4 left-4 cursor-pointer text-gray-300' />
        </Link>
      </header>

      <AtivosNaoAtivos
        ativos={ativos}
        title="Ativos"
        iconColor="bg-green-500" />

      <AtivosNaoAtivos
        ativos={naoAtivos}
        title="Não ativos"
        iconColor="bg-yellow-500" />

      <Patrimonio patrimonio={evolucao} />
      <Metas metas={metas} />

      {/* <Carteira perfil={perfil} />
      <Corretoras corretoras={corretoras} /> */}
    </main>
  )
}