export function formatValue(v: any): string {
  if (typeof v === 'number') {
    return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }
  return String(v)
}

export default formatValue
