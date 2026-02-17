import { formatValue } from './formatValue';

export const parseCurrency = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) / 100 : 0;
};

export const formatCurrencyInput = (value: string) => {
  if (!value) return '';
  return formatValue(parseCurrency(value));
};
