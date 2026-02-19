import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertState {
  message: string;
  variant: AlertVariant;
  isVisible: boolean;
}

interface AlertContextType {
  alert: AlertState;
  showAlert: (message: string, variant: AlertVariant, duration?: number) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({
    message: '',
    variant: 'info',
    isVisible: false,
  });
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showAlert = (message: string, variant: AlertVariant, duration: number = 5000) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setAlert({
      message,
      variant,
      isVisible: true,
    });

    const id = setTimeout(() => {
      setAlert(prev => ({
        ...prev,
        isVisible: false,
      }));
    }, duration);

    setTimeoutId(id);
  };

  const hideAlert = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setAlert(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert deve ser usado dentro de AlertProvider');
  }
  return context;
}
