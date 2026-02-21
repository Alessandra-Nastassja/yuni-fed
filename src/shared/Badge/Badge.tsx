interface BadgeProps {
  tipo: string;
  formatLabel?: (tipo: string) => string;
  excludeTypes?: string[];
}

export default function Badge({ 
  tipo, 
  formatLabel,
  excludeTypes = ['investimentos']
}: BadgeProps) {
  if (excludeTypes.includes(tipo)) {
    return null;
  }

  return (
    <article>
      <small className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
        {formatLabel ? formatLabel(tipo) : tipo}
      </small>
    </article>
  );
}
