/**
 * Converte string de moeda em número
 * @param value - String de moeda (ex: "R$ 1.234,56")
 * @returns Número parseado
 */
export const parseMoneyString = (value: string): number => {
  if (!value) return 0;
  
  // Remove tudo exceto dígitos, vírgula, ponto e hífen
  let normalized = value.replace(/[^\d,.-]/g, "");
  
  // Remove pontos (separador de milhar brasileiro)
  normalized = normalized.replace(/\./g, "");
  
  // Substitui vírgula por ponto (decimal brasileiro -> padrão)
  normalized = normalized.replace(",", ".");
  
  return parseFloat(normalized) || 0;
};

/**
 * Converte dígitos para valor numérico em centavos
 */
export const parseCurrency = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) / 100 : 0;
};

/**
 * Formata número como moeda brasileira
 * @param value - Número a formatar
 * @returns String formatada como moeda (ex: "R$ 1.234,56")
 */
export const formatValue = (v: any): string => {
  if (typeof v === 'number') {
    return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }
  return String(v)
};

/**
 * Alias para formatValue - mantém compatibilidade
 */
export const formatAsMoney = (value: number): string => {
  return formatValue(value);
};

/**
 * Formata valor como moeda a partir de string
 */
export const formatCurrencyInput = (value: string): string => {
  if (!value) return '';
  const parsed = parseCurrency(value);
  return formatValue(parsed);
};

/**
 * Aplica máscara de moeda em um input do DOM
 */
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

export default formatValue;
