import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faCalendarDays,
  faChartLine,
  faList,
  faDollarSign,
  faPercent,
  faTag,
  faShield,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "../../../../../shared/SelectField/selectField";
import InputField from "../../../../../shared/InputField/inputField";
import AlertBox from "../../../../../shared/Alert/AlertBox";
import {
  CORRETORAS_OPTIONS,
  DEBENTURE_TIPO_OPTIONS,
  RENDA_FIXA_TIPO_ATIVO_OPTIONS,
  TAXA_TIPO_OPTIONS,
} from "../../../../../const/ativos";

interface RendaFixaFormProps {
  riscoOptions: Array<{ value: string; label: string }>;
  onChange?: (data: any) => void;
}

interface RiskFieldProps {
  id: string;
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

function RiskSelectField({ id, name, label, options, onChange, defaultValue = "" }: RiskFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
        <FontAwesomeIcon icon={faShield} className="text-gray-400" />
        <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor={id}>{label}</label>
        <select
          id={id}
          name={name}
          className="w-full bg-transparent outline-none"
          defaultValue={defaultValue}
          onChange={(event) => onChange?.(event.target.value)}
        >
          <option value="" disabled>Selecione</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function RendaFixaForm({ riscoOptions, onChange }: RendaFixaFormProps) {
  const [tipoAtivo, setTipoAtivo] = useState("");
  const [tipoDebenture, setTipoDebenture] = useState("");
  const [tipoTaxa, setTipoTaxa] = useState("");

  const isIsentoIR = ["lci", "lca", "cri", "cra"].includes(tipoAtivo) ||
    (tipoAtivo === "debenture" && tipoDebenture === "incentivada");

  const isManualIR = tipoAtivo === "outros";

  return (
    <>
      <SelectField
        id="tipoAtivoRendaFixa"
        name="tipoAtivoRendaFixa"
        label="Tipo de ativo"
        icon={faTag}
        options={RENDA_FIXA_TIPO_ATIVO_OPTIONS}
        onChange={(value) => {
          setTipoAtivo(value);
          setTipoTaxa("");
          setTipoDebenture("");
        }}
        defaultValue=""
      />

      {tipoAtivo === "debenture" && (
        <SelectField
          id="tipoDebenture"
          name="tipoDebenture"
          label="Tipo de debenture"
          icon={faList}
          options={DEBENTURE_TIPO_OPTIONS}
          onChange={(value) => setTipoDebenture(value)}
          defaultValue=""
        />
      )}

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

      <SelectField
        id="corretora"
        name="corretora"
        label="Corretora"
        icon={faBuildingColumns}
        options={CORRETORAS_OPTIONS}
        defaultValue=""
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
        id="tipoTaxa"
        name="tipoTaxa"
        label="Tipo de taxa"
        icon={faList}
        options={TAXA_TIPO_OPTIONS}
        onChange={(value) => setTipoTaxa(value)}
        defaultValue=""
      />

      {tipoTaxa === "prefixado" && (
        <InputField
          id="taxaContratada"
          name="taxaContratada"
          label="Taxa contratada"
          icon={faChartLine}
          type="text"
          inputMode="decimal"
          placeholder="Taxa anual (%)"
        />
      )}

      {tipoTaxa === "pos_fixado_cdi" && (
        <>
          <InputField
            id="percentualCdi"
            name="percentualCdi"
            label="% do CDI"
            icon={faPercent}
            type="text"
            inputMode="decimal"
            placeholder="110%"
          />

          <InputField
            id="cdiAtual"
            name="cdiAtual"
            label="CDI atual"
            icon={faPercent}
            type="text"
            placeholder="10,65% a.a"
            readOnly
          />
        </>
      )}

      {tipoTaxa === "ipca" && (
        <InputField
          id="ipcaTaxa"
          name="ipcaTaxa"
          label="IPCA + taxa"
          icon={faPercent}
          type="text"
          inputMode="decimal"
          placeholder="IPCA + 0,00%"
        />
      )}

      {isIsentoIR ? (
        <AlertBox type="success">
          <span className="text-xs font-medium">Isento de IR</span>
        </AlertBox>
      ) : (
        <InputField
          id="irEstimado"
          name="irEstimado"
          label="IR estimado"
          icon={faPercent}
          type="text"
          inputMode="decimal"
          placeholder="0,00%"
          readOnly={!isManualIR}
        />
      )}

      <RiskSelectField
        id="categoriaRiscoRendaFixa"
        name="categoriaRiscoRendaFixa"
        label="Nível de risco"
        options={riscoOptions}
        defaultValue=""
      />

      <InputField
        id="valorFinalEstimado"
        name="valorFinalEstimado"
        label="Valor final estimado"
        icon={faDollarSign}
        type="text"
        inputMode="decimal"
        placeholder="R$ 0,00"
        readOnly
      />
    </>
  );
}