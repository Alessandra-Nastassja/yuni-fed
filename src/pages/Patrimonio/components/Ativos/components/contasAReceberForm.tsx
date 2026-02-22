import { faLink, faList } from "@fortawesome/free-solid-svg-icons";

import SelectField from "@shared/SelectField/selectField";
import DropdownSearch from "@shared/DropdownSearch/DropdownSearch";
import { RENDA_VARIAVEL_TIPO_LABELS } from "@const/ativos";

interface SelectOption {
  value: string;
  label: string;
}

interface AtivoRendaVariavel {
  tipoRendaVariavel?: string;
}

interface AtivoItem {
  id: number;
  nome: string;
  rendaVariavel?: AtivoRendaVariavel;
}

interface ContasAReceberFormProps {
  categoriaContasAReceber: string;
  categoriasDisponiveis: SelectOption[];
  ativosFiltrados: AtivoItem[];
  ativoVinculado: string;
  onCategoriaChange: (value: string) => void;
  onAtivoVinculadoChange: (value: string) => void;
}

const getAtivoPlaceholder = (categoria: string): string => {
  if (categoria === "dividendos" || categoria === "jcp") {
    return "Digite o nome da ação";
  }
  if (categoria === "rendimento") {
    return "Digite o nome do FII";
  }
  if (categoria === "proventos") {
    return "Digite o nome do ETF";
  }
  return "Digite o nome da ação, FII ou ETF";
};

export function ContasAReceberForm({
  categoriaContasAReceber,
  categoriasDisponiveis,
  ativosFiltrados,
  ativoVinculado,
  onCategoriaChange,
  onAtivoVinculadoChange,
}: ContasAReceberFormProps) {
  return (
    <>
      <SelectField
        id="categoriaContasAReceber"
        name="categoriaContasAReceber"
        label="Categoria"
        icon={faList}
        options={categoriasDisponiveis}
        onChange={onCategoriaChange}
        defaultValue=""
      />

      {categoriaContasAReceber && categoriaContasAReceber !== "outros" && (
        <DropdownSearch
          id="ativoVinculado"
          label="Ativo"
          icon={faLink}
          placeholder={getAtivoPlaceholder(categoriaContasAReceber)}
          items={ativosFiltrados.map((ativo) => ({
            id: ativo.id,
            nome: ativo.nome,
            suffix: ativo.rendaVariavel?.tipoRendaVariavel || undefined,
          }))}
          value={ativoVinculado}
          onChange={onAtivoVinculadoChange}
          renderItemSuffix={(item) => {
            if (item.suffix) {
              return `(${RENDA_VARIAVEL_TIPO_LABELS[item.suffix] || item.suffix})`;
            }
            return "";
          }}
          emptyMessage="Nenhum ativo encontrado"
        />
      )}
    </>
  );
}
