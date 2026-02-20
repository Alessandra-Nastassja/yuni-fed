export const formatCurrencyInput = (value: string): string => {
  // Remove tudo que não é número
  const numericValue = value.replace(/\D/g, '');
  
  // Se vazio, retorna vazio
  if (!numericValue) return '';
  
  // Converte para número e formata
  const numberValue = parseInt(numericValue, 10) / 100;
  
  // Formata como moeda brasileira
  return numberValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const applyMoneyMask = (inputId: string) => {
  const input = document.getElementById(inputId) as HTMLInputElement;
  
  if (!input) return;
  
  const handleInput = () => {
    const cursorPosition = input.selectionStart || 0;
    const oldValue = input.value;
    const formatted = formatCurrencyInput(oldValue);
    input.value = formatted;
    
    // Adjust cursor position
    const diff = formatted.length - oldValue.length;
    input.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
  };
  
  input.addEventListener('input', handleInput);
  
  return () => input.removeEventListener('input', handleInput);
};
