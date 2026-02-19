import type { ReactNode } from "react";

interface AlertBoxProps {
  children: ReactNode;
  type?: 'info' | 'success' | 'warning';
}

export default function AlertBox({ children, type = 'info' }: AlertBoxProps) {
  const styles = {
    info: 'bg-blue-50 border border-gray-200',
    success: 'bg-green-50 text-green-700',
    warning: 'rounded-lg px-3 py-2 text-xs',
  };
  
  return (
    <div className={`rounded-lg px-3 py-2 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}