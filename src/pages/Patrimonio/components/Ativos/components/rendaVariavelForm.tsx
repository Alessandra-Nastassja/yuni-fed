import { useState, useCallback } from "react";
import {
  faBuildingColumns,
  faCalendarDays,
  faDollarSign,
  faHashtag,
  faList,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "../../../../../shared/SelectField/selectField";
import InputField from "../../../../../shared/InputField/inputField";
import { RiskSelectField } from "../../../../../shared/RiskSelectField/RiskSelectField";
import { CORRETORAS_OPTIONS } from "../../../../../const/ativos";
import { useMoneyMask, useMultiInputCalculation } from "../../../../../hooks";
import { ReadOnlyField } from "../../../../../shared/ReadOnlyField/ReadOnlyField";
import { MONEY_INPUT_IDS, RENDA_VARIAVEL_CONDITIONS, RENDA_VARIAVEL_DESCRIPTIONS } from "../../../../../const/ativos";
import { RendaVariavelFormProps } from "../../../../../types";
import { parseMoneyString, formatAsMoney } from "../../../../../utils/currency";

const TIPOS_RENDA_VARIAVEL = [
  { value: "acoes", label: "Ações" },
  { value: "fii", label: "FII" },
  { value: "etf", label: "ETF" },
] as const;

/**
 * Calcula o valor atual baseado em quantidade e preço
 */
const calcularValorAtual = (): string => {
  const quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
  const precoAtualInput = document.getElementById("precoAtual") as HTMLInputElement;
  const precoMedioInput = document.getElementById("precoMedio") as HTMLInputElement;

  if (!quantidadeInput?.value) return "";

  const quantidade = parseFloat(quantidadeInput.value);
  const precoAtual = precoAtualInput?.value
    ? parseMoneyString(precoAtualInput.value)
    : parseMoneyString(precoMedioInput?.value || "0");

  if (!quantidade || !precoAtual) return "";

  const valorAtual = quantidade * precoAtual;
  return formatAsMoney(valorAtual);
};

export function RendaVariavelForm({ riscoOptions }: RendaVariavelFormProps) {
  const [tipoRendaVariavel, setTipoRendaVariavel] = useState("");
  const [valorAtual, setValorAtual] = useState("");

  // Aplicar máscaras de moeda
  useMoneyMask(MONEY_INPUT_IDS.rendaVariavel);

  // Calcular valor atual automaticamente
  useMultiInputCalculation(
    ["quantidade", "precoAtual", "precoMedio"],
    "valorAtual",
    () => {
      const novoValor = calcularValorAtual();
      setValorAtual(novoValor);
      return novoValor;
    }
  );

  const shouldShowAcoes =
    tipoRendaVariavel === "acoes" && RENDA_VARIAVEL_CONDITIONS.acoes;
  const shouldShowFII = tipoRendaVariavel === "fii" && RENDA_VARIAVEL_CONDITIONS.fii;
  const shouldShowETF = tipoRendaVariavel === "etf" && RENDA_VARIAVEL_CONDITIONS.etf;

  return (
    <>
      <SelectField
        id="tipoRendaVariavel"
        name="tipoRendaVariavel"
        label="Tipo de ativo"
        icon={faList}
        options={TIPOS_RENDA_VARIAVEL}
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

      <ReadOnlyField
        icon={faDollarSign}
        label="Valor atual (calculado)"
        value={valorAtual}
        isSkeleton={false}
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

      {shouldShowAcoes && (
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
            options={RENDA_VARIAVEL_DESCRIPTIONS.acoes.irOptions}
            defaultValue=""
          />
        </>
      )}

      {shouldShowFII && (
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

      {shouldShowETF && (
        <SelectField
          id="irEstimado"
          name="irEstimado"
          label="IR estimado"
          icon={faPercent}
          options={RENDA_VARIAVEL_DESCRIPTIONS.etf.irOptions}
          defaultValue=""
        />
      )}
    </>
  );
}