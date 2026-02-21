import { useEffect, useState } from "react";
import {
  faChartLine,
  faList,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";
import SelectField from "../../../../../shared/SelectField/selectField";
import InputField from "../../../../../shared/InputField/inputField";
import { TAXA_TIPO_OPTIONS } from "../../../../../const/ativos";
import { FIXED_INCOME_RATE_TYPES } from "../../../../../const/ativos";

interface TaxaSectionProps {
  tipoTaxa: string;
  onTaxaTypeChange: (value: string) => void;
  taxaContratada?: string;
  percentualCdi?: string;
  ipcaTaxa?: string;
  onValuesChange?: (values: { taxaContratada?: string; percentualCdi?: string; ipcaTaxa?: string }) => void;
}

/**
 * Componente TaxaSection - Seção para gerenciar tipos de taxa
 * Mostra campos diferentes dependendo do tipo de taxa selecionada
 */
export function TaxaSection({
  tipoTaxa,
  onTaxaTypeChange,
  taxaContratada,
  percentualCdi,
  ipcaTaxa,
  onValuesChange,
}: TaxaSectionProps) {
  const [values, setValues] = useState({
    taxaContratada: taxaContratada || "",
    percentualCdi: percentualCdi || "",
    ipcaTaxa: ipcaTaxa || "",
  });

  useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);

  return (
    <>
      <SelectField
        id="tipoTaxa"
        name="tipoTaxa"
        label="Tipo de taxa"
        icon={faList}
        options={TAXA_TIPO_OPTIONS}
        onChange={(value) => onTaxaTypeChange(value)}
        defaultValue={tipoTaxa}
      />

      {tipoTaxa === FIXED_INCOME_RATE_TYPES.prefixado && (
        <InputField
          id="taxaContratada"
          name="taxaContratada"
          label="Taxa contratada"
          icon={faChartLine}
          type="number"
          inputMode="decimal"
          placeholder="Taxa anual (%)"
          maxLength={3}
          value={values.taxaContratada}
          onChange={(e) =>
            setValues({ ...values, taxaContratada: e.target.value })
          }
        />
      )}

      {tipoTaxa === FIXED_INCOME_RATE_TYPES.posFiXadoCdi && (
        <>
          <InputField
            id="percentualCdi"
            name="percentualCdi"
            label="% do CDI"
            icon={faPercent}
            type="text"
            inputMode="decimal"
            placeholder="110%"
            value={values.percentualCdi}
            onChange={(e) =>
              setValues({ ...values, percentualCdi: e.target.value })
            }
          />

          <InputField
            id="cdiAtualDisplay"
            name="cdiAtualDisplay"
            label="CDI atual"
            icon={faPercent}
            type="text"
            placeholder="10,65% a.a"
            readOnly
          />
          <input type="hidden" id="cdiAtual" name="cdiAtual" value="10.65" />
        </>
      )}

      {tipoTaxa === FIXED_INCOME_RATE_TYPES.ipca && (
        <InputField
          id="ipcaTaxa"
          name="ipcaTaxa"
          label="IPCA + taxa"
          icon={faPercent}
          type="text"
          inputMode="decimal"
          placeholder="IPCA + 0,00%"
          value={values.ipcaTaxa}
          onChange={(e) =>
            setValues({ ...values, ipcaTaxa: e.target.value })
          }
        />
      )}
    </>
  );
}
