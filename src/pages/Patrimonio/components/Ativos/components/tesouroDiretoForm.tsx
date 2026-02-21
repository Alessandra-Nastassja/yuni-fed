import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faCalendarDays,
  faChartLine,
  faList,
  faDollarSign,
  faShield,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "../../../../../shared/SelectField/selectField";
import InputField from "../../../../../shared/InputField/inputField";
import AlertBox from "../../../../../shared/Alert/AlertBox";
import { TESOURO_TIPO_OPTIONS, CORRETORAS_OPTIONS } from "../../../../../const/ativos";
import { calcularValorAtualTesouroDireto } from "../../../../../utils/investmentCalculations";
import { formatValue } from "../../../../../utils/currency";
import { useMoneyMask, useMultiInputCalculation } from "../../../../../hooks";
import { ReadOnlyField } from "../../../../../shared/ReadOnlyField/ReadOnlyField";
import { MONEY_INPUT_IDS } from "../../../../../const/ativos";
import { TesouroDiretoFormProps } from "../types";

const TAXA_PLACEHOLDERS = {
  tesouro_prefixado: "Taxa fixa (%)",
  tesouro_ipca: "IPCA + X%",
  tesouro_selic: "Selic",
  default: "0,00%",
} as const;

export function TesouroDiretoForm({}: TesouroDiretoFormProps) {
  const [tipoTesouro, setTipoTesouro] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [hasCalculatedValue, setHasCalculatedValue] = useState(false);

  // Aplicar máscara de moeda
  useMoneyMask(MONEY_INPUT_IDS.tesouro);

  // Calcular valor atual automaticamente
  useMultiInputCalculation(
    ["valorInvestido", "taxaRentabilidade", "dataCompra", "dataVencimento"],
    "valorAtual",
    () => {
      const valorInvestidoInput = document.getElementById("valorInvestido") as HTMLInputElement;
      const taxaRentabilidadeInput = document.getElementById("taxaRentabilidade") as HTMLInputElement;
      const dataCompraInput = document.getElementById("dataCompra") as HTMLInputElement;
      const dataVencimentoInput = document.getElementById("dataVencimento") as HTMLInputElement;

      const hasInputs = Boolean(
        valorInvestidoInput?.value ||
        dataCompraInput?.value ||
        dataVencimentoInput?.value ||
        taxaRentabilidadeInput?.value
      );

      if (!hasInputs) {
        setHasCalculatedValue(false);
        return "";
      }

      setHasCalculatedValue(true);

      const calculatedValue = calcularValorAtualTesouroDireto({
        valorInvestido: valorInvestidoInput?.value,
        taxaRentabilidade: taxaRentabilidadeInput?.value,
        dataCompra: dataCompraInput?.value,
        dataVencimento: dataVencimentoInput?.value,
      });

      const formatted = formatValue(calculatedValue);
      setValorAtual(formatted);
      return formatted;
    }
  );

  const getTaxaPlaceholder = (): string => {
    return (
      TAXA_PLACEHOLDERS[tipoTesouro as keyof typeof TAXA_PLACEHOLDERS] ||
      TAXA_PLACEHOLDERS.default
    );
  };

  return (
    <>
      <SelectField
        id="tipoTesouro"
        name="tipoTesouro"
        label="Tipo de investimento"
        icon={faList}
        options={TESOURO_TIPO_OPTIONS}
        onChange={(value) => setTipoTesouro(value)}
        defaultValue=""
      />

      <AlertBox type="info">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faShield} className="text-blue-400" />
          <span className="text-sm text-blue-700">Nível de risco</span>
          <span className="text-xs text-blue-600 font-medium ml-auto">Baixo</span>
        </div>
      </AlertBox>

      <InputField
        id="valorInvestido"
        name="valorInvestido"
        label="Valor investido"
        icon={faDollarSign}
        type="text"
        inputMode="decimal"
        placeholder="R$ 0,00"
      />

      <InputField
        id="taxaRentabilidade"
        name="taxaRentabilidade"
        label="Taxa de rentabilidade"
        icon={faChartLine}
        type="number"
        inputMode="decimal"
        placeholder={getTaxaPlaceholder()}
      />

      <InputField
        id="dataCompra"
        name="dataCompra"
        label="Data de compra"
        icon={faCalendarDays}
        type="date"
      />

      <InputField
        id="dataVencimento"
        name="dataVencimento"
        label="Data de vencimento"
        icon={faCalendarDays}
        type="date"
      />

      <ReadOnlyField
        icon={faDollarSign}
        label="Valor atual (R$)"
        value={valorAtual}
        isSkeleton={!hasCalculatedValue && valorAtual === ""}
      />

      <SelectField
        id="corretora"
        name="corretora"
        label="Corretora"
        icon={faBuildingColumns}
        options={CORRETORAS_OPTIONS}
        defaultValue=""
      />
    </>
  );
}