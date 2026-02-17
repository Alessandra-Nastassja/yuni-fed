import { formatValue } from '../../../../utils/formatValue'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLink, faEye, faLink, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Modal from '../../../../shared/Modal/Modal'

export default function MetasList({ className, metas }: { className?: string, metas?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <header className="flex items-center justify-between">
        <p className="text-lg">Metas</p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-sm text-blue-500 hover:underline inline-flex items-center"
        >
          <FontAwesomeIcon size='sm' icon={faExternalLink} className="mr-1 text-gray-400" />
        </button>
      </header>
      {metas && metas.length > 0 ? (
        metas.map((meta, index) => (
          <div key={index} className="flex flex-col justify-between gap-2">
            <div className='flex justify-between gap-5'>
              <p className="text-base">{meta.nome}</p>

              <div className="flex justify-between gap-1">
                {/* <small className="text-xs text-gray-500">R$ {formatValue(meta.valorAtual)}</small> */}
                <small className="text-xs text-gray-500">de R$ {formatValue(meta.valorMeta)}</small>
              </div>

            </div>

            {/* <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                className="bg-green-500 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ width: `${(meta.valorAtual / meta.valorMeta * 100).toFixed(2)}%` }}
              >
                <span className="text-white text-xs font-medium">
                  {(meta.valorAtual / meta.valorMeta * 100).toFixed(2)}%
                </span>
              </div>
            </div> */}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Nenhuma meta cadastrada.</p>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="space-y-4">
          
        </div>
      </Modal>
    </section>
  )
}