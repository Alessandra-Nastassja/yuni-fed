import { formatValue } from '../../../../utils/formatValue'

interface Meta {
  descricao: string
  valorObjetivo: number
  valorAtual?: number
}

interface MetasListProps {
  metas: Meta[]
  onAddClick: () => void
}

export default function MetasList({ metas, onAddClick }: MetasListProps) {
  return (
    <>
      {metas && metas.length > 0 ? (
        // TODO: fazer ordenação por percentual de alcance da meta (valorAtual / valorObjetivo) no back
        metas
        .sort((a, b) => {
          const pa = a.valorObjetivo ? (Number(a.valorAtual ?? 0) / Number(a.valorObjetivo)) * 100 : 0
          const pb = b.valorObjetivo ? (Number(b.valorAtual ?? 0) / Number(b.valorObjetivo)) * 100 : 0
          return pa - pb
        })
        .map((meta, index) => (
          <section key={index} className="flex flex-col justify-between gap-2">
            <div className='flex justify-between gap-5'>
              <p className="text-base">{meta.descricao}</p>

              <div className="flex justify-between gap-1">
                <small className="text-xs text-gray-500">R$ {formatValue(meta.valorAtual ?? 0)}</small>
                <small className="text-xs text-gray-500">de R$ {formatValue(meta.valorObjetivo)}</small>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
              {(() => {
                const percentual = meta.valorObjetivo ? ((Number(meta.valorAtual ?? 0) / Number(meta.valorObjetivo)) * 100) : 0;
                let bgColor = 'bg-red-500';
                if (percentual >= 75) bgColor = 'bg-green-500';
                else if (percentual >= 25) bgColor = 'bg-yellow-500';
                
                return (
                  <div
                    className={`${bgColor} h-6 rounded-full transition-all duration-300 flex items-center ${percentual === 0 ? 'ml-2' : 'pl-2'}`}
                    style={{
                      width: `${percentual.toFixed(2)}%`,
                    }}
                  >
                    <span className="text-white text-xs font-medium">
                      {percentual.toFixed(2)}%
                    </span>
                  </div>
                );
              })()}
            </div>
          </section>
        ))
      ) : (
        <p className="text-sm flex gap-1 text-gray-500">
          Nenhuma meta cadastrada! Cadastre uma 
          <button
            type="button"
            onClick={onAddClick}
            className="text-sm text-blue-500 hover:underline inline-flex items-center"
          >
            aqui
          </button>
        </p>
      )}
    </>
  )
}
