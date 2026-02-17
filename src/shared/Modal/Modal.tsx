import { ReactNode } from 'react';

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <div className={`relative w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl ${className ?? ''}`}>
        {children}
      </div>
    </div>
  );
}
