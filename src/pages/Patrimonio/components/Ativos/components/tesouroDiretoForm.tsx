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

interface TesouroDiretoFormProps {
  onChange?: (data: any) => void;
}

export function TesouroDiretoForm({ onChange }: TesouroDiretoFormProps) {
  const [tipoTesouro, setTipoTesouro] = useState("");

  const getTaxaPlaceholder = () => {
    switch (tipoTesouro) {
      case "tesouro_prefixado":
        return "Taxa fixa (%)";
      case "tesouro_ipca":
        return "IPCA + X%";
      case "tesouro_selic":
        return "Selic";
      default:
        return "0,00%";
    }
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
        id="valorAtual"
        name="valorAtual"
        label="Valor atual"
        icon={faDollarSign}
        type="text"
        inputMode="decimal"
        placeholder="R$ 0,00"
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

      <SelectField
        id="corretora"
        name="corretora"
        label="Corretora"
        icon={faBuildingColumns}
        options={CORRETORAS_OPTIONS}
        defaultValue=""
      />

      <InputField
        id="taxaRentabilidade"
        name="taxaRentabilidade"
        label="Taxa de rentabilidade"
        icon={faChartLine}
        type="text"
        inputMode="decimal"
        placeholder={getTaxaPlaceholder()}
      />

      <AlertBox type="info">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faShield} className="text-blue-400" />
          <span className="text-sm text-blue-700">Nível de risco</span>
          <span className="text-xs text-blue-600 font-medium ml-auto">Baixo</span>
        </div>
      </AlertBox>
    </>
  );
}