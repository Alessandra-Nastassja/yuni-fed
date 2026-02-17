import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Patrimonio from "./components/Patrimonio/patrimonio";
import Carteira from "./components/Carteira/carteira";
import Corretoras from "./components/Corretoras/corretoras";
import Metas from "./components/Metas/metas";

export default function Investimentos({ corretoras, perfil, metas }: { corretoras?: any[], perfil?: any, metas?: any[] }) {
  
  return (
    <main className='p-4 space-y-4'>
      <header className="mb-8">
        <Link to="/" className="text-blue-600 hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} size='2xl' className='absolute top-4 left-4 cursor-pointer text-gray-300' />
        </Link>
      </header>

      <Patrimonio />

      <Metas metas={metas} />
      {/* <Carteira perfil={perfil} />
      <Corretoras corretoras={corretoras} /> */}
    </main>
  )
}