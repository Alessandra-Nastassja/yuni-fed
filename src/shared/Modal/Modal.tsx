import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

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

  return createPortal(
    <div className="fixed inset-0 z-[60] pointer-events-auto">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <div className={`fixed inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl ${className ?? ''}`}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
