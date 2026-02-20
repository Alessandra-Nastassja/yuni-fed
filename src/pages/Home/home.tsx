import AtivosList from '../Patrimonio/components/Ativos/ativosList';
import Metas from './components/Metas/metas';

export default function Home() {
  return (
     <main className='m-4 p-4 space-y-4'>
      <Metas />
      <AtivosList title="Ativos" iconColor="bg-green-500" />
    </main>
  )
}