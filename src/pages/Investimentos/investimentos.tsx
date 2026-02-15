import { Link } from "react-router-dom";
import AtivosNaoAtivos from "./components/AtivosNaoAtivos/ativosNaoAtivos";
import Carteira from "./components/Carteira/carteira";
import Corretoras from "./components/Corretoras/corretoras";
import Metas from "./components/Metas/metas";
import Patrimonio from "./components/Patrimonio/patrimonio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Investimentos({ ativos, naoAtivos, corretoras, perfil, patrimonio, metas }: { ativos: any[], naoAtivos: any[], corretoras: any[], perfil: any, patrimonio: any, metas: any[] }) {
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

      <Patrimonio patrimonio={patrimonio} />
      <Carteira perfil={perfil} />
      <Metas metas={metas} />
      <Corretoras corretoras={corretoras} />
    </main>
  )
}