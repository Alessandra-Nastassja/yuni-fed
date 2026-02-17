interface LoadingProps {
  isLoading: boolean
  message?: string
}

export default function Loading({ isLoading, message = 'Carregando...' }: LoadingProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        <p className="text-gray-700 text-sm">{message}</p>
      </div>
    </div>
  )
}
