import { formatValue } from '../../../../utils/formatValue'

interface Meta {
  nome: string
  valorMeta: number
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
        metas.map((meta, index) => (
          <div key={index} className="flex flex-col justify-between gap-2">
            <div className='flex justify-between gap-5'>
              <p className="text-base">{meta.nome}</p>

              <div className="flex justify-between gap-1">
                <small className="text-xs text-gray-500">R$ {formatValue(meta.valorAtual ?? 0)}</small>
                <small className="text-xs text-gray-500">de R$ {formatValue(meta.valorMeta)}</small>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                className="bg-green-500 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{
                  width: `${meta.valorMeta ? ((Number(meta.valorAtual ?? 0) / Number(meta.valorMeta)) * 100).toFixed(2) : 0}%`,
                }}
              >
                <span className="text-white text-xs font-medium">
                  {meta.valorMeta ? ((Number(meta.valorAtual ?? 0) / Number(meta.valorMeta)) * 100).toFixed(2) : '0.00'}%
                </span>
              </div>
            </div>
          </div>
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
