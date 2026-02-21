export default function NaoAtivosCreate() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Não Ativo</h1>
      {/* Formulário para criar um novo não ativo */}
      <form className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome do Não Ativo
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Carro, Imóvel, etc."
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
            Descrição          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Detalhes adicionais sobre o não ativo"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Salvar Não Ativo
        </button>
      </form>
    </div>
  );
}