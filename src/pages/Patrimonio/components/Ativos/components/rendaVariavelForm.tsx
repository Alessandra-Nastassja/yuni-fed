import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faCalendarDays,
  faDollarSign,
  faHashtag,
  faList,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "@shared/SelectField/selectField";
import InputField from "@shared/InputField/inputField";
import { RiskSelectField } from "@shared/RiskSelectField/RiskSelectField";
import { CORRETORAS_OPTIONS } from "@const/ativos";
import { useMoneyMask, useMultiInputCalculation } from "../../../../../hooks";
import { ReadOnlyField } from "@shared/ReadOnlyField/ReadOnlyField";
import { RENDA_VARIAVEL_CONDITIONS } from "@const/ativos";
import type { RendaVariavelFormProps } from "../../../../../types";
import { parseMoneyString, formatAsMoney } from "@utils/currency";
import { clampNonNegativeInt } from "@utils/number";

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
  useMoneyMask(["precoCompra", "precoMedio", "precoAtual", "dividendosRecebidos", "dividendYield"]);

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

  const updateQuantidade = (nextValue: number) => {
    const input = document.getElementById("quantidade") as HTMLInputElement | null;
    if (!input) return;
    const safeValue = clampNonNegativeInt(nextValue || 0);
    input.value = String(safeValue);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const handleQuantidadeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    if (Number.isNaN(nextValue) || nextValue < 0) {
      updateQuantidade(0);
      return;
    }
    updateQuantidade(nextValue);
  };

  const handleIncreaseQuantidade = () => {
    const input = document.getElementById("quantidade") as HTMLInputElement | null;
    const currentValue = input ? Number(input.value) || 0 : 0;
    updateQuantidade(currentValue + 1);
  };

  const handleDecreaseQuantidade = () => {
    const input = document.getElementById("quantidade") as HTMLInputElement | null;
    const currentValue = input ? Number(input.value) || 0 : 0;
    updateQuantidade(currentValue - 1);
  };

  return (
    <>
      <SelectField
        id="tipoRendaVariavel"
        name="tipoRendaVariavel"
        label="Tipo de ativo"
        icon={faList}
        options={[...TIPOS_RENDA_VARIAVEL]}
        onChange={(value) => setTipoRendaVariavel(value)}
        defaultValue=""
      />

      <RiskSelectField
        id="categoriaRiscoRendaVariavel"
        name="categoriaRiscoRendaVariavel"
        label="Nível de risco"
        options={riscoOptions}
        defaultValue=""
      />

      <div className="space-y-1">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <FontAwesomeIcon icon={faHashtag} className="text-gray-400" />
          <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            name="quantidade"
            type="number"
            inputMode="numeric"
            min={0}
            className="w-full bg-transparent outline-none text-right"
            placeholder="0"
            onChange={handleQuantidadeChange}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-7 w-7 rounded-full border border-gray-300 text-gray-600"
              onClick={handleDecreaseQuantidade}
              aria-label="Diminuir quantidade"
            >
              -
            </button>
            <button
              type="button"
              className="h-7 w-7 rounded-full border border-gray-300 text-gray-600"
              onClick={handleIncreaseQuantidade}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
        </div>
      </div>

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

      {/* TODO: integração com mercado (B3, Api de mercado ou último fechamento) */}
      <InputField
        id="precoAtual"
        name="precoAtual"
        label="Preço de referência (mercado)"
        icon={faDollarSign}
        type="text"
        inputMode="decimal"
        placeholder="R$ 0,00"
      />

      <ReadOnlyField
        icon={faDollarSign}
        label="Valor investido (R$)"
        value={valorInvestido}
        isSkeleton={false}
      />

      <ReadOnlyField
        icon={faDollarSign}
        label="Valor atual (R$)"
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

      {shouldShowAcoes && (
        <>
          <InputField
            id="dataCompra"
            name="dataCompra"
            label="Data de compra"
            icon={faCalendarDays}
            type="date"
          />
        </>
      )}
    </>
  );
}