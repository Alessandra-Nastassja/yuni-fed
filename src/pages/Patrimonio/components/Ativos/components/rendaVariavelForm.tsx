import { useState, useEffect } from "react";
import {
  faBuildingColumns,
  faCalendarDays,
  faDollarSign,
  faHashtag,
  faList,
  faPercent,
  faShield,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "../../../../../shared/SelectField/selectField";
import InputField from "../../../../../shared/InputField/inputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CORRETORAS_OPTIONS } from "../../../../../const/ativos";

interface RendaVariavelFormProps {
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

export function RendaVariavelForm({ riscoOptions }: RendaVariavelFormProps) {
  const [tipoRendaVariavel, setTipoRendaVariavel] = useState("");

  useEffect(() => {
    const quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
    const precoAtualInput = document.getElementById("precoAtual") as HTMLInputElement;
    const precoMedioInput = document.getElementById("precoMedio") as HTMLInputElement;
    const valorAtualInput = document.getElementById("valorAtual") as HTMLInputElement;

    const calcularValor = () => {
      if (quantidadeInput?.value && (precoAtualInput?.value || precoMedioInput?.value)) {
        const quantidade = parseFloat(quantidadeInput.value);
        const precoAtual = precoAtualInput?.value 
          ? parseFloat(precoAtualInput.value.replace(/[^\d,.-]/g, "").replace(",", ".")) 
          : parseFloat((precoMedioInput.value || "0").replace(/[^\d,.-]/g, "").replace(",", "."));
        
        const valorAtual = quantidade * precoAtual;
        if (valorAtualInput) {
          valorAtualInput.value = valorAtual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
      }
    };

    const listeners = [
      () => quantidadeInput?.addEventListener("change", calcularValor),
      () => precoAtualInput?.addEventListener("change", calcularValor),
      () => precoMedioInput?.addEventListener("change", calcularValor),
      () => {
        quantidadeInput?.addEventListener("input", calcularValor);
        precoAtualInput?.addEventListener("input", calcularValor);
        precoMedioInput?.addEventListener("input", calcularValor);
      }
    ];

    listeners.forEach(listener => listener());

    return () => {
      quantidadeInput?.removeEventListener("change", calcularValor);
      quantidadeInput?.removeEventListener("input", calcularValor);
      precoAtualInput?.removeEventListener("change", calcularValor);
      precoAtualInput?.removeEventListener("input", calcularValor);
      precoMedioInput?.removeEventListener("change", calcularValor);
      precoMedioInput?.removeEventListener("input", calcularValor);
    };
  }, []);

  return (
    <>
      <SelectField
        id="tipoRendaVariavel"
        name="tipoRendaVariavel"
        label="Tipo de ativo"
        icon={faList}
        options={[
          { value: "acoes", label: "Ações" },
          { value: "fii", label: "FII" },
          { value: "etf", label: "ETF" },
        ]}
        onChange={(value) => setTipoRendaVariavel(value)}
        defaultValue=""
      />

      <InputField
        id="quantidade"
        name="quantidade"
        label="Quantidade"
        icon={faHashtag}
        type="number"
        inputMode="numeric"
        placeholder="0"
      />

      <InputField
        id="precoMedio"
        name="precoMedio"
        label="Preço médio"
        icon={faDollarSign}
        type="text"
        inputMode="decimal"
        placeholder="R$ 0,00"
      />

      <InputField
        id="precoAtual"
        name="precoAtual"
        label="Preço atual (mercado)"
        icon={faDollarSign}
        type="text"
        inputMode="decimal"
        placeholder="R$ 0,00"
      />

      <InputField
        id="valorAtual"
        name="valorAtual"
        label="Valor atual (calculado)"
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

      <RiskSelectField
        id="categoriaRiscoRendaVariavel"
        name="categoriaRiscoRendaVariavel"
        label="Nível de risco"
        options={riscoOptions}
        defaultValue=""
      />

      {tipoRendaVariavel === "acoes" && (
        <>
          <InputField
            id="dataCompra"
            name="dataCompra"
            label="Data de compra"
            icon={faCalendarDays}
            type="date"
          />

          <InputField
            id="dividendosRecebidos"
            name="dividendosRecebidos"
            label="Dividendos recebidos"
            icon={faDollarSign}
            type="text"
            inputMode="decimal"
            placeholder="R$ 0,00"
          />

          <SelectField
            id="irEstimado"
            name="irEstimado"
            label="IR estimado"
            icon={faPercent}
            options={[
              { value: "15", label: "15% (normal)" },
              { value: "20", label: "20% (day trade)" },
            ]}
            defaultValue=""
          />
        </>
      )}

      {tipoRendaVariavel === "fii" && (
        <>
          <InputField
            id="dividendYield"
            name="dividendYield"
            label="Dividend yield"
            icon={faPercent}
            type="text"
            inputMode="decimal"
            placeholder="0,00%"
          />

          <InputField
            id="irEstimado"
            name="irEstimado"
            label="IR estimado"
            icon={faPercent}
            type="text"
            inputMode="decimal"
            placeholder="20%"
          />
        </>
      )}

      {tipoRendaVariavel === "etf" && (
        <SelectField
          id="irEstimado"
          name="irEstimado"
          label="IR estimado"
          icon={faPercent}
          options={[
            { value: "15", label: "15% (normal)" },
            { value: "20", label: "20% (day trade)" },
          ]}
          defaultValue=""
        />
      )}
    </>
  );
}