import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange, faPlus, faMinus, faCreditCard, faTimes, faCoins } from '@fortawesome/free-solid-svg-icons';

interface NewOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const optionsByRoute: Record<string, Array<{
  id: string;
  label: string;
  icon: any;
  color: string;
  iconColor: string;
  type: string;
}>> = {
  '/financas': [
    {
      id: 'receita',
      label: 'Receita',
      icon: faPlus,
      color: 'bg-green-100',
      iconColor: 'text-green-500',
      type: 'receita',
    },
    {
      id: 'despesa',
      label: 'Despesa',
      icon: faMinus,
      color: 'bg-red-100',
      iconColor: 'text-red-500',
      type: 'despesa',
    },
    // {
    //   id: 'despesa_cartao',
    //   label: 'Despesa cartão',
    //   icon: faCreditCard,
    //   color: 'bg-blue-100',
    //   iconColor: 'text-blue-500',
    //   type: 'despesa_cartao',
    // },
    // {
    //   id: 'transferencia',
    //   label: 'Transferência',
    //   icon: faExchange,
    //   color: 'bg-yellow-100',
    //   iconColor: 'text-yellow-500',
    //   type: 'transferencia',
    // },
  ],
  '/patrimonio': [
    {
      id: 'ativos',
      label: 'Ativos',
      icon: faCoins,
      color: 'bg-purple-100',
      iconColor: 'text-purple-500',
      type: 'ativos',
    },
    {
      id: 'naoAtivos',
      label: 'Não Ativos',
      icon: faCoins,
      color: 'bg-blue-100',
      iconColor: 'text-blue-500',
      type: 'naoAtivos ',
    },
  ],
};

export default function NewOptionModal({ isOpen, onClose }: NewOptionModalProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const options = optionsByRoute[location.pathname] || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Fechar"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <h2 className="text-lg font-semibold">Criar</h2>
        <div className="w-8" />
      </header>

      <div className="flex flex-col">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              navigate('/novo', { state: { type: option.type } });
              onClose();
            }}
            className="flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${option.color}`}>
              <FontAwesomeIcon icon={option.icon} className={`h-6 w-6 ${option.iconColor}`} />
            </div>
            <p className="text-gray-900">{option.label}</p>
          </button>
        ))}
      </div>
    </Modal>
  );
}
