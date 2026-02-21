import { useState, useCallback } from "react";
import {
  faBuildingColumns,
  faCalendarDays,
  faDollarSign,
  faHashtag,
  faList,
  faPercent,
  faChartLine,
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
 * Calcula os valores baseado em quantidade, preço de compra e preço atual
 */
const calcularValores = (): { valorInvestido: string; valorAtual: string; resultado: string; percentual: string } => {
  const quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
  const precoCompraInput = document.getElementById("precoCompra") as HTMLInputElement;
  const precoAtualInput = document.getElementById("precoAtual") as HTMLInputElement;

  if (!quantidadeInput?.value || !precoCompraInput?.value || !precoAtualInput?.value) {
    return { valorInvestido: "", valorAtual: "", resultado: "", percentual: "" };
  }

  const quantidade = parseFloat(quantidadeInput.value);
  const precoCompra = parseMoneyString(precoCompraInput.value);
  const precoAtual = parseMoneyString(precoAtualInput.value);

  if (!quantidade || !precoCompra || !precoAtual) {
    return { valorInvestido: "", valorAtual: "", resultado: "", percentual: "" };
  }

  const valorInvestido = quantidade * precoCompra;
  const valorAtualCalculado = quantidade * precoAtual;
  const resultado = valorAtualCalculado - valorInvestido;
  const percentual = (resultado / valorInvestido) * 100;

  return {
    valorInvestido: formatAsMoney(valorInvestido),
    valorAtual: formatAsMoney(valorAtualCalculado),
    resultado: formatAsMoney(resultado),
    percentual: percentual.toFixed(2),
  };
};

export function RendaVariavelForm({ riscoOptions }: RendaVariavelFormProps) {
  const [tipoRendaVariavel, setTipoRendaVariavel] = useState("");
  const [precoMedio, setPrecoMedio] = useState("");
  const [valorInvestido, setValorInvestido] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [resultado, setResultado] = useState("");
  const [percentual, setPercentual] = useState("");

  // Aplicar máscaras de moeda
  useMoneyMask(MONEY_INPUT_IDS.rendaVariavel);

  // Calcular preço médio (precoCompra)
  const calcularPrecoMedio = useCallback((): string => {
    const quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
    const precoCompraInput = document.getElementById("precoCompra") as HTMLInputElement;

    if (!quantidadeInput?.value || !precoCompraInput?.value) return "";

    const quantidade = parseFloat(quantidadeInput.value);
    const precoCompra = parseMoneyString(precoCompraInput.value);

    if (!quantidade || !precoCompra) return "";

    return formatAsMoney(precoCompra);
  }, []);

  // Calcular valores automaticamente
  useMultiInputCalculation(
    ["quantidade", "precoCompra", "precoAtual"],
    "valores",
    () => {
      const valores = calcularValores();
      setPrecoMedio(calcularPrecoMedio());
      setValorInvestido(valores.valorInvestido);
      setValorAtual(valores.valorAtual);
      setResultado(valores.resultado);
      setPercentual(valores.percentual);
      return valores.valorInvestido;
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
        id="precoCompra"
        name="precoCompra"
        label="Preço de compra (unitário)"
        icon={faDollarSign}
        type="text"
        inputMode="decimal"
        placeholder="R$ 0,00"
      />

      <ReadOnlyField
        icon={faDollarSign}
        label="Preço médio"
        value={precoMedio}
        isSkeleton={false}
      />

      <input type="hidden" id="precoMedio" name="precoMedio" value={precoMedio} />

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
        label="Valor investido"
        value={valorInvestido}
        isSkeleton={false}
      />

      <ReadOnlyField
        icon={faDollarSign}
        label="Valor atual"
        value={valorAtual}
        isSkeleton={false}
      />

      <ReadOnlyField
        icon={faDollarSign}
        label="Resultado (R$)"
        value={resultado}
        isSkeleton={false}
      />

      <ReadOnlyField
        icon={faPercent}
        label="Resultado (%)"
        value={percentual ? `${percentual}%` : ""}
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