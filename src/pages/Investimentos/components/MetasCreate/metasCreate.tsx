export default function MetasCreate() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Criar Nova Meta</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome da Meta</label>
          <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Valor da Meta (R$)</label>
          <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Criar Meta
        </button>
      </form>
    </div>
  )
}