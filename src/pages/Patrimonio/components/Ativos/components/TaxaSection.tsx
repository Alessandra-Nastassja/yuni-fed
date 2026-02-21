import { useEffect, useState } from "react";
import {
  faChartLine,
  faList,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";
import SelectField from "../../../../../shared/SelectField/selectField";
import InputField from "../../../../../shared/InputField/inputField";
import { TAXA_TIPO_OPTIONS, INDICES } from "../../../../../const/ativos";
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
  const [taxaFixaIpca, setTaxaFixaIpca] = useState("");

  // Resetar valores quando o tipo de taxa mudar
  useEffect(() => {
    setValues({
      taxaContratada: taxaContratada || "",
      percentualCdi: percentualCdi || "",
      ipcaTaxa: ipcaTaxa || "",
    });
    setTaxaFixaIpca("");
  }, [tipoTaxa, taxaContratada, percentualCdi]); // Removido ipcaTaxa para não interferir no cálculo composto

  // Calcular taxa composta IPCA + taxa fixa quando mudar
  // Fórmula: (1 + IPCA/100) × (1 + taxa_fixa/100) - 1
  useEffect(() => {
    if (tipoTaxa === FIXED_INCOME_RATE_TYPES.ipca && taxaFixaIpca) {
      const taxaFixaNum = parseFloat(taxaFixaIpca) || 0;
      // Fórmula composta: (1.048 × 1.05 - 1) × 100 = 10.04%
      const taxaComposta = ((1 + INDICES.ipcaAproximado / 100) * (1 + taxaFixaNum / 100) - 1) * 100;
      setValues(prev => ({ ...prev, ipcaTaxa: String(taxaComposta.toFixed(2)) }));
    }
  }, [taxaFixaIpca, tipoTaxa]);

  useEffect(() => {
    onValuesChange?.(values);
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SelectField
        id="tipoTaxa"
        name="tipoTaxa"
        label="Tipo de taxa"
        icon={faList}
        options={TAXA_TIPO_OPTIONS}
        onChange={(value) => onTaxaTypeChange(value)}
        value={tipoTaxa}
      />

      {tipoTaxa === FIXED_INCOME_RATE_TYPES.prefixado && (
        <InputField
          id="taxaContratada"
          name="taxaContratada"
          label="Taxa contratada (%)"
          icon={faChartLine}
          type="number"
          inputMode="decimal"
          placeholder="Taxa anual (%)"
          maxLength={3}
          value={values.taxaContratada}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
        <>
          <InputField
            id="ipcaAtualDisplay"
            name="ipcaAtualDisplay"
            label="IPCA atual"
            icon={faPercent}
            type="text"
            placeholder="4,80% a.a"
            value={`${INDICES.ipcaAproximado.toFixed(2)}% a.a`}
            readOnly
          />
          
          <InputField
            id="taxaFixaIpca"
            name="taxaFixaIpca"
            label="Taxa fixa (a.a)"
            icon={faChartLine}
            type="number"
            inputMode="decimal"
            placeholder="5,20"
            value={taxaFixaIpca}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaxaFixaIpca(e.target.value)}
          />
          
          <InputField
            id="taxaTotalDisplay" 
            name="taxaTotalDisplay"
            label={taxaFixaIpca ? `Taxa total (IPCA atual + Taxa fixa)` : "Taxa total"}
            icon={faPercent}
            type="text"
            value={taxaFixaIpca ? `${values.ipcaTaxa}% a.a` : '-'}
            readOnly
          />
          
          <input type="hidden" id="ipcaTaxa" name="ipcaTaxa" value={values.ipcaTaxa} />
        </>
      )}
    </>
  );
}
