interface BadgeProps {
  tipo?: string;
  label?: string;
  formatLabel?: (tipo: string) => string;
  excludeTypes?: string[];
  className?: string;
}

export default function Badge({ 
  tipo, 
  label,
  formatLabel,
  excludeTypes = ['investimentos'],
  className = 'bg-gray-100 text-gray-600'
}: BadgeProps) {
  if (tipo && excludeTypes.includes(tipo)) {
    return null;
  }

  const displayText = label || (tipo && formatLabel ? formatLabel(tipo) : tipo) || '';

  return (
    <article>
      <small className={`${className} px-2 py-1 rounded text-xs w-fit`}>
        {displayText}
      </small>
    </article>
  );
}
