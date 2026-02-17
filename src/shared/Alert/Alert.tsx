import { ReactNode } from 'react';

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
}: {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-3 py-2 text-sm ${variantStyles[variant]} ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
