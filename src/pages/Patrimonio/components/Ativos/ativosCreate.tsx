import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faList,
  faShield,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "../../../../shared/SelectField/selectField";
import InputField from "../../../../shared/InputField/inputField";
import {
  ATIVOS_CATEGORIA_INVESTIMENTO_OPTIONS,
  ATIVOS_FONTE_RENDA_OPTIONS,
  ATIVOS_TIPO_OPTIONS,
  RISCO_BAIXO,
  RISCO_BAIXO_MEDIO,
  RISCO_BAIXO_MEDIO_ALTO,
  RISCO_MEDIO_ALTO,
} from "../../../../const/ativos";

import { TesouroDiretoForm } from "./components/TesouroDiretoForm";
import { RendaFixaForm } from "./components/RendaFixaForm";
import { RendaVariavelForm } from "./components/RendaVariavelForm";

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

export default function AtivosCreate() {
  const [tipoAtivo, setTipoAtivo] = useState("");
  const [tipoInvestimento, setTipoInvestimento] = useState("");
  const [tipoAtivoRendaFixa, setTipoAtivoRendaFixa] = useState("");
  const [tipoRendaVariavel, setTipoRendaVariavel] = useState("");
  const [tipoFonteRenda, setTipoFonteRenda] = useState("");

  const getRiscoOptions = () => {
    if (tipoInvestimento === "tesouro_direto") {
      return RISCO_BAIXO;
    }
    if (tipoInvestimento === "renda_fixa") {
      if (["lci", "lca", "cri", "cra"].includes(tipoAtivoRendaFixa)) {
        return RISCO_BAIXO;
      }
      if (tipoAtivoRendaFixa === "cdb" || tipoAtivoRendaFixa === "lc") {
        return RISCO_BAIXO_MEDIO;
      }
      if (tipoAtivoRendaFixa === "debenture") {
        return RISCO_MEDIO_ALTO;
      }
    }
    if (tipoInvestimento === "renda_variavel") {
      if (tipoRendaVariavel === "acoes") {
        return RISCO_MEDIO_ALTO;
      }
      if (tipoRendaVariavel === "fii") {
        return RISCO_BAIXO_MEDIO;
      }
    }
    return RISCO_BAIXO_MEDIO_ALTO;
  };

  const riscoOptions = getRiscoOptions();

  return (
    <main className="m-4 p-4">
      <form className="space-y-4">
        <InputField
          id="nome"
          name="nome"
          label="Nome"
          icon={faTag}
          placeholder="Nome do ativo"
          maxLength={30}
        />

        <SelectField
          id="tipo"
          name="tipo"
          label="Tipo"
          icon={faList}
          options={ATIVOS_TIPO_OPTIONS}
          onChange={(value) => setTipoAtivo(value)}
          defaultValue=""
        />

        {['conta_corrente', 'meu_negocio'].includes(tipoAtivo) && (
          <SelectField
            id="tipoFonteRenda"
            name="tipoFonteRenda"
            label="Tipo de Fonte de Renda"
            icon={faList}
            options={ATIVOS_FONTE_RENDA_OPTIONS}
            onChange={(value) => setTipoFonteRenda(value)}
            defaultValue=""
          />
        )}

        {tipoAtivo !== "" && tipoAtivo !== "investimentos" && (
          <InputField
            id="valorAtual"
            name="valorAtual"
            label="Valor atual"
            icon={faDollarSign}
            type="text"
            inputMode="decimal"
            placeholder="R$ 0,00"
          />
        )}

        {tipoAtivo === "investimentos" && (
          <SelectField
            id="tipoInvestimento"
            name="tipoInvestimento"
            label="Categoria de investimento"
            icon={faList}
            options={ATIVOS_CATEGORIA_INVESTIMENTO_OPTIONS}
            onChange={(value) => {
              setTipoInvestimento(value);
              setTipoAtivoRendaFixa("");
              setTipoRendaVariavel("");
            }}
            defaultValue=""
          />
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "tesouro_direto" && (
          <TesouroDiretoForm />
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "renda_fixa" && (
          <RendaFixaForm riscoOptions={riscoOptions} />
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "renda_variavel" && (
          <RendaVariavelForm riscoOptions={riscoOptions} />
        )}

        {tipoAtivo === "investimentos" &&
          tipoInvestimento !== "tesouro_direto" &&
          tipoInvestimento !== "renda_fixa" &&
          tipoInvestimento !== "renda_variavel" &&
          tipoInvestimento !== "" && (
            <>
              <RiskSelectField
                id="categoriaRisco"
                name="categoriaRisco"
                label="Nível de risco"
                options={RISCO_BAIXO_MEDIO_ALTO}
                defaultValue=""
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
            </>
          )}
      </form>
    </main>
  );
}