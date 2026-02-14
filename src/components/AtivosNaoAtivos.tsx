type Labels = Record<string, string>

export default function AtivosNaoAtivos({
  className,
  ativos,
  title = 'Ativos',
  labels = {},
}: {
  className?: string
  ativos?: any[]
  title?: string
  labels?: Labels
}) {
  const humanize = (key: string) => {
    if (key === 'FGTS') return 'FGTS'
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (c) => c.toUpperCase())
  }

  const formatValue = (v: any) => {
    if (typeof v === 'number') {
      return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    }
    return String(v)
  }

  return (
    <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
      <p className="text-lg">{title}</p>

      {(ativos ?? []).map((ativo, index) => (
        <article key={index} className="flex flex-col gap-1">
          {ativo.ano && <p className="font-medium">{ativo.ano}</p>}

          {Object.entries(ativo)
            .filter(([k]) => k !== 'ano')
            .map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <p>{labels[k] ?? humanize(k)}</p>
                <p className="font-medium">{formatValue(v)}</p>
              </div>
            ))}
        </article>
      ))}
    </section>
  )
}