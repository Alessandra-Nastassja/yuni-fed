export default function PerfilInvestimentos({ className }: { className?: string }) {
  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <p className="text-lg">Meu perfil de investidor</p>
  
      <article className="flex flex-col gap-1">  
        <div className="flex justify-between">
          <p>Conservador</p>
          <p className="font-medium">R$ 19.547,24</p>
        </div>
  
        <div className="flex justify-between">
          <p>Moderado</p>
          <p className="font-medium">R$ 206.388,59</p>
        </div>
  
        <div className="flex justify-between">
          <p>Agressivo</p>
          <p className="font-medium">R$ 1.966,52</p>
        </div>
      </article>
  
      <footer className="flex flex-row justify-between mt-2 bg-gray-100 p-4 rounded-lg items-center">
        <p className="font-medium">Total</p>
        <small className="text-gray-600 font-medium">R$ 227.892,35</small>
      </footer>
    </section>
  )
}