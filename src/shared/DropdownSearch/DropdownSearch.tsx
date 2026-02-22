import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

interface DropdownSearchItem {
  id: number;
  nome: string;
  suffix?: string;
}

interface DropdownSearchProps {
  id: string;
  label: string;
  icon: any;
  placeholder: string;
  items: DropdownSearchItem[];
  value: string;
  onChange: (value: string) => void;
  minSearchChars?: number;
  emptyMessage?: string;
  renderItemSuffix?: (item: DropdownSearchItem) => string;
}

export default function DropdownSearch({
  id,
  label,
  icon,
  placeholder,
  items,
  value,
  onChange,
  minSearchChars = 3,
  emptyMessage = "Nenhum item encontrado",
  renderItemSuffix,
}: DropdownSearchProps) {
  const [listaAberta, setListaAberta] = useState(false);
  const [suppressAutoOpen, setSuppressAutoOpen] = useState(false);

  // Filtrar itens baseado no valor de busca
  const itensFiltrados = items.filter((item) => {
    if (value.length >= minSearchChars) {
      return item.nome.toLowerCase().includes(value.toLowerCase());
    }
    return true;
  });

  // Mostrar lista quando clica na lupa (sem valor) ou quando digita 3+ caracteres
  const mostrarLista = listaAberta || (value.length >= minSearchChars && !suppressAutoOpen);

  const handleClear = () => {
    onChange("");
    setListaAberta(false);
    setSuppressAutoOpen(false);
  };

  const handleSelectItem = (itemNome: string) => {
    onChange(itemNome);
    setListaAberta(false);
    setSuppressAutoOpen(true);
  };

  const handleSearchClick = () => {
    setListaAberta(!listaAberta);
    setSuppressAutoOpen(false);
  };

  return (
    <div className="space-y-1 relative">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
        <FontAwesomeIcon icon={icon} className="text-gray-400" />
        <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor={id}>
          {label}
        </label>
        <input
          type="text"
          id={id}
          name={id}
          className="w-full bg-transparent outline-none text-gray-700"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setSuppressAutoOpen(false);
            onChange(e.target.value);
            if (e.target.value.length >= minSearchChars) {
              setListaAberta(true);
            } else {
              setListaAberta(false);
            }
          }}
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Limpar seleção"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSearchClick}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Pesquisar todos os itens"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        )}
      </div>

      {/* Lista dropdown de itens */}
      {mostrarLista && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {itensFiltrados.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">{emptyMessage}</p>
          ) : (
            <div className="py-2">
              {itensFiltrados.map((item) => {
                const suffix = renderItemSuffix ? renderItemSuffix(item) : item.suffix || "";
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item.nome)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-800">{item.nome}</span>
                    {suffix && <span className="text-gray-500 text-sm ml-2">{suffix}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
