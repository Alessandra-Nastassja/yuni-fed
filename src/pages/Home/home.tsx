import MetasList from '../Investimentos/components/MetasList/metasList';

export default function Home({ metas }: { metas?: any[] }) {
  return (
     <main className='m-4 p-4 space-y-4'>
      <MetasList metas={metas} />
    </main>
  )
}