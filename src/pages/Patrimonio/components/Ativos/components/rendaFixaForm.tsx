import { useState, useEffect, useCallback } from "react";
import {
  faBuildingColumns,
  faTag,
  faDollarSign,
  faList,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "../../../../../shared/SelectField/selectField";
import InputField from "../../../../../shared/InputField/inputField";
import { RiskSelectField } from "../../../../../shared/RiskSelectField/RiskSelectField";
import { ReadOnlyField } from "../../../../../shared/ReadOnlyField/ReadOnlyField";
import { IRSection } from "./IRSection";
import { TaxaSection } from "./TaxaSection";

import {
  CORRETORAS_OPTIONS,
  DEBENTURE_TIPO_OPTIONS,
  RENDA_FIXA_TIPO_ATIVO_OPTIONS,
} from "../../../../../const/ativos";
import { calcularValorAtualRendaFixa } from "../../../../../utils/investmentCalculations";
import { formatValue } from "../../../../../utils/currency";
import { useMoneyMask, useDateInputListener } from "../../../../../hooks";
import { MONEY_INPUT_IDS, INDICES, FIXED_INCOME_RATE_TYPES } from "../../../../../const/ativos";
import {
  calcularAliquotaIR,
  isRendaFixaIsentaIR,
  isIRManual,
  calcularAnos,
  calcularRendimentoBruto,
  calcularValorLiquidoRendaFixa,
} from "../../../../../utils/investmentCalculations";
import { parseMoneyString, formatAsMoney } from "../../../../../utils/currency";
import { RendaFixaFormProps } from "../../../../../types";

/**
 * Valida se há inputs suficientes para cálculos
 */
const temInputsSuficientes = (
  valorInvestido: string,
  dataCompra: string,
  dataVencimento: string,
  taxaContratada?: string,
  percentualCdi?: string,
  ipcaTaxa?: string
): boolean => {
  return !!(
    valorInvestido &&
    dataCompra &&
    dataVencimento &&
    (taxaContratada || percentualCdi || ipcaTaxa)
  );
};

export function RendaFixaForm({ riscoOptions }: RendaFixaFormProps) {
  const [tipoAtivo, setTipoAtivo] = useState("");
  const [tipoDebenture, setTipoDebenture] = useState("");
  const [tipoTaxa, setTipoTaxa] = useState("");
  const [dataCompra, setDataCompra] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [irEstimado, setIrEstimado] = useState("");
  const [valorInvestido, setValorInvestido] = useState("");
  const [taxaContratada, setTaxaContratada] = useState("");
  const [percentualCdi, setPercentualCdi] = useState("");
  const [ipcaTaxa, setIpcaTaxa] = useState("");
  const [valorFinalEstimado, setValorFinalEstimado] = useState("");
  const [valorAtual, setValorAtual] = useState("");

  const isIsentaIR = isRendaFixaIsentaIR(tipoAtivo, tipoDebenture);
  const isManualIR = isIRManual(tipoAtivo);

  // Aplicar máscaras de moeda
  useMoneyMask(MONEY_INPUT_IDS.rendaFixa);

  // Listener para mudanças de data
  useDateInputListener((dataCompraValue, dataVencimentoValue) => {
    setDataCompra(dataCompraValue);
    setDataVencimento(dataVencimentoValue);
  });

  // Cálculo automático de IR baseado em datas
  useEffect(() => {
    if (isIsentaIR) {
      setIrEstimado("0");
      return;
    }

    if (isManualIR) {
      return;
    }

    // Para tipos que calculam automático
    if (["cdb", "lc", "debenture"].includes(tipoAtivo)) {
      if (dataCompra && dataVencimento) {
        const ir = calcularAliquotaIR(dataCompra, dataVencimento);
        setIrEstimado(String(ir));
      } else {
        setIrEstimado("15");
      }
    }
  }, [tipoAtivo, tipoDebenture, dataCompra, dataVencimento, isIsentaIR, isManualIR]);

  // Função para calcular valor final estimado
  const calcularValorFinal = useCallback(() => {
    if (
      !temInputsSuficientes(
        valorInvestido,
        dataCompra,
        dataVencimento,
        taxaContratada,
        percentualCdi,
        ipcaTaxa
      )
    ) {
      setValorFinalEstimado("");
      return;
    }

    const valor = parseMoneyString(valorInvestido);
    const anos = calcularAnos(dataCompra, dataVencimento);

    let taxa = 0;
    let parametrosAdicionais: Record<string, number> = {};

    if (tipoTaxa === FIXED_INCOME_RATE_TYPES.prefixado) {
      taxa = parseFloat(taxaContratada || "0");
    } else if (tipoTaxa === FIXED_INCOME_RATE_TYPES.posFiXadoCdi) {
      parametrosAdicionais = {
        cdiAtual: INDICES.cdiAtual,
        percentualCdi: parseFloat(percentualCdi || "0"),
      };
    } else if (tipoTaxa === FIXED_INCOME_RATE_TYPES.ipca) {
      parametrosAdicionais = {
        ipcaAtual: INDICES.ipcaAproximado,
        ipcaTaxa: parseFloat(ipcaTaxa || "0"),
      };
    }

    const valorBruto = calcularRendimentoBruto(
      valor,
      taxa,
      anos,
      tipoTaxa,
      parametrosAdicionais
    );

    const aliquotaIR = isIsentaIR ? 0 : parseFloat(irEstimado || "15");
    const valorLiquido = calcularValorLiquidoRendaFixa(
      valorBruto,
      valor,
      aliquotaIR,
      isIsentaIR
    );

    setValorFinalEstimado(formatAsMoney(valorLiquido));
  }, [
    valorInvestido,
    dataCompra,
    dataVencimento,
    taxaContratada,
    percentualCdi,
    ipcaTaxa,
    tipoTaxa,
    irEstimado,
    isIsentaIR,
  ]);

  // Função para calcular valor atual
  const calcularValorAtualAtualizado = useCallback((): string => {
    if (
      !temInputsSuficientes(
        valorInvestido,
        dataCompra,
        dataVencimento,
        taxaContratada,
        percentualCdi,
        ipcaTaxa
      )
    ) {
      return "";
    }

    const valor = calcularValorAtualRendaFixa({
      valorInvestido,
      tipoTaxa,
      taxaContratada,
      percentualCdi,
      cdiAtual: String(INDICES.cdiAtual),
      ipcaTaxa,
      dataCompra,
      dataVencimento,
    });

    return formatValue(valor);
  }, [
    valorInvestido,
    taxaContratada,
    percentualCdi,
    ipcaTaxa,
    dataCompra,
    dataVencimento,
    tipoTaxa,
  ]);

  // Cálculo de valor final estimado
  useEffect(() => {
    calcularValorFinal();
  }, [calcularValorFinal]);

  // Cálculo de valor atual
  useEffect(() => {
    const novoValorAtual = calcularValorAtualAtualizado();
    setValorAtual(novoValorAtual);
  }, [calcularValorAtualAtualizado]);

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

      <RiskSelectField
        id="categoriaRiscoRendaFixa"
        name="categoriaRiscoRendaFixa"
        label="Nível de risco"
        options={riscoOptions}
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
        onChange={(e) => setValorInvestido(e.target.value)}
      />

      <TaxaSection
        tipoTaxa={tipoTaxa}
        onTaxaTypeChange={(value) => {
          setTipoTaxa(value);
          setTaxaContratada("");
          setPercentualCdi("");
          setIpcaTaxa("");
        }}
        taxaContratada={taxaContratada}
        percentualCdi={percentualCdi}
        ipcaTaxa={ipcaTaxa}
        onValoresChange={(values) => {
          if (values.taxaContratada !== undefined)
            setTaxaContratada(values.taxaContratada);
          if (values.percentualCdi !== undefined)
            setPercentualCdi(values.percentualCdi);
          if (values.ipcaTaxa !== undefined) setIpcaTaxa(values.ipcaTaxa);
        }}
      />

      <ReadOnlyField
        icon={faDollarSign}
        label="Valor atual"
        value={valorAtual}
        isSkeleton={
          !valorAtual &&
          temInputsSuficientes(
            valorInvestido,
            dataCompra,
            dataVencimento,
            taxaContratada,
            percentualCdi,
            ipcaTaxa
          )
        }
      />

      <InputField
        id="dataCompra"
        name="dataCompra"
        label="Data de compra"
        icon={faTag}
        type="date"
      />

      <InputField
        id="dataVencimento"
        name="dataVencimento"
        label="Data de vencimento"
        icon={faTag}
        type="date"
      />

      <IRSection
        tipoAtivo={tipoAtivo}
        tipoDebenture={tipoDebenture}
        irEstimado={irEstimado}
        onIRChange={(value) => setIrEstimado(value)}
      />

      <ReadOnlyField
        icon={faDollarSign}
        label="Valor líquido estimado"
        value={valorFinalEstimado}
        isSkeleton={
          !valorFinalEstimado &&
          temInputsSuficientes(
            valorInvestido,
            dataCompra,
            dataVencimento,
            taxaContratada,
            percentualCdi,
            ipcaTaxa
          )
        }
      />
      <input
        type="hidden"
        id="valorFinalEstimado"
        name="valorFinalEstimado"
        value={valorFinalEstimado}
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
