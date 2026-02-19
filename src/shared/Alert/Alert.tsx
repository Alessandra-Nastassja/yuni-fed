import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const variantStyles: Record<AlertVariant, string> = {
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  error: 'bg-red-50 text-red-700 border-red-200',
};

export default function Alert({
  children,
  variant = 'info',
  className,
  onClose,
}: {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-3 py-2 text-sm flex items-center justify-between ${variantStyles[variant]} ${className ?? ''}`}
    >
      <span>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:opacity-70"
          aria-label="Fechar alerta"
        >
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </button>
      )}
    </div>
  );
}
