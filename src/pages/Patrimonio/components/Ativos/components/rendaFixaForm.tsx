import { useState, useEffect } from "react";
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
import { calcularValorAtualRendaFixa } from "../../../../../utils/investmentCalculations";
import { formatValue } from "../../../../../utils/formatValue";
import { applyMoneyMask } from "../../../../../utils/currencyMask";

interface RendaFixaFormProps {
  riscoOptions: Array<{ value: string; label: string }>;
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

  const isIsentoIR = ["lci", "lca", "cri", "cra"].includes(tipoAtivo) ||
    (tipoAtivo === "debenture" && tipoDebenture === "incentivada");

  const isManualIR = tipoAtivo === "outros";

  // Calcula IR automático baseado no prazo do investimento
  const calcularIR = (dataInicio: string, dataFim: string) => {
    if (!dataInicio || !dataFim) return "";
    
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 180) return "22.5";
    if (diffDays <= 360) return "20";
    if (diffDays <= 720) return "17.5";
    return "15";
  };

  // Calcula o valor final estimado baseado no tipo de taxa
  const calcularValorFinal = () => {
    const valor = parseFloat(valorInvestido.replace(/[^\d,.-]/g, "").replace(",", ".") || "0");
    
    if (!valor || !dataCompra || !dataVencimento) {
      setValorFinalEstimado("");
      return;
    }

    const inicio = new Date(dataCompra);
    const fim = new Date(dataVencimento);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const anos = diffTime / (1000 * 60 * 60 * 24 * 365);

    let valorBruto = 0;

    if (tipoTaxa === "prefixado") {
      const taxa = parseFloat(taxaContratada.replace(/[^\d,.-]/g, "").replace(",", ".") || "0");
      valorBruto = valor * Math.pow(1 + taxa / 100, anos);
    } else if (tipoTaxa === "pos_fixado_cdi") {
      const percCdi = parseFloat(percentualCdi.replace(/[^\d,.-]/g, "").replace(",", ".") || "0");
      const cdiAtual = 10.65; // CDI atual aproximado
      const taxaEfetiva = (cdiAtual * percCdi) / 100;
      valorBruto = valor * Math.pow(1 + taxaEfetiva / 100, anos);
    } else if (tipoTaxa === "ipca") {
      const taxaIpca = parseFloat(ipcaTaxa.replace(/[^\d,.-]/g, "").replace(",", ".") || "0");
      const ipcaAtual = 4.5; // IPCA aproximado
      const taxaTotal = ipcaAtual + taxaIpca;
      valorBruto = valor * Math.pow(1 + taxaTotal / 100, anos);
    }

    if (valorBruto > 0) {
      // Calcular o rendimento
      const rendimento = valorBruto - valor;
      
      // Calcular IR sobre o rendimento (se não for isento)
      let valorIR = 0;
      if (!isIsentoIR && irEstimado) {
        const aliquotaIR = parseFloat(irEstimado) / 100;
        valorIR = rendimento * aliquotaIR;
      }
      
      // Valor final líquido (valor bruto - IR)
      const valorLiquido = valorBruto - valorIR;
      
      setValorFinalEstimado(valorLiquido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
    } else {
      setValorFinalEstimado("");
    }
  };

  // Aplicar máscaras de moeda nos campos de dinheiro
  useEffect(() => {
    applyMoneyMask("valorInvestido");
    // applyMoneyMask("taxaContratada");
    applyMoneyMask("cdiAtual");
  }, []);

  // Atualiza IR automaticamente quando o tipo de ativo ou datas mudarem
  useEffect(() => {
    if (isIsentoIR) {
      setIrEstimado("0");
      return;
    }

    if (isManualIR) {
      // Para "outros", mantém o valor manual
      return;
    }

    // Para CDB, LC, Debenture comum: calcular automaticamente
    if (["cdb", "lc", "debenture"].includes(tipoAtivo) || (tipoAtivo === "debenture" && tipoDebenture === "comum")) {
      if (dataCompra && dataVencimento) {
        const ir = calcularIR(dataCompra, dataVencimento);
        setIrEstimado(ir);
      } else {
        // Valor padrão mais comum (acima de 720 dias)
        setIrEstimado("15");
      }
    }
  }, [tipoAtivo, tipoDebenture, dataCompra, dataVencimento, isIsentoIR, isManualIR]);

  // Captura mudanças nos campos de data via DOM
  useEffect(() => {
    const dataCompraInput = document.getElementById("dataCompra") as HTMLInputElement;
    const dataVencimentoInput = document.getElementById("dataVencimento") as HTMLInputElement;

    const handleDataChange = () => {
      if (dataCompraInput?.value) setDataCompra(dataCompraInput.value);
      if (dataVencimentoInput?.value) setDataVencimento(dataVencimentoInput.value);
    };

    dataCompraInput?.addEventListener("change", handleDataChange);
    dataVencimentoInput?.addEventListener("change", handleDataChange);

    return () => {
      dataCompraInput?.removeEventListener("change", handleDataChange);
      dataVencimentoInput?.removeEventListener("change", handleDataChange);
    };
  }, []);

  // Captura mudanças nos campos de valores via DOM
  useEffect(() => {
    const valorInvestidoInput = document.getElementById("valorInvestido") as HTMLInputElement;
    const taxaContratadaInput = document.getElementById("taxaContratada") as HTMLInputElement;
    const percentualCdiInput = document.getElementById("percentualCdi") as HTMLInputElement;
    const ipcaTaxaInput = document.getElementById("ipcaTaxa") as HTMLInputElement;

    const handleValoresChange = () => {
      if (valorInvestidoInput?.value) setValorInvestido(valorInvestidoInput.value);
      if (taxaContratadaInput?.value) setTaxaContratada(taxaContratadaInput.value);
      if (percentualCdiInput?.value) setPercentualCdi(percentualCdiInput.value);
      if (ipcaTaxaInput?.value) setIpcaTaxa(ipcaTaxaInput.value);
    };

    valorInvestidoInput?.addEventListener("input", handleValoresChange);
    taxaContratadaInput?.addEventListener("input", handleValoresChange);
    percentualCdiInput?.addEventListener("input", handleValoresChange);
    ipcaTaxaInput?.addEventListener("input", handleValoresChange);

    return () => {
      valorInvestidoInput?.removeEventListener("input", handleValoresChange);
      taxaContratadaInput?.removeEventListener("input", handleValoresChange);
      percentualCdiInput?.removeEventListener("input", handleValoresChange);
      ipcaTaxaInput?.removeEventListener("input", handleValoresChange);
    };
  }, [tipoTaxa]);

  // Recalcula valor final quando os valores mudarem
  useEffect(() => {
    calcularValorFinal();
  }, [valorInvestido, taxaContratada, percentualCdi, ipcaTaxa, dataCompra, dataVencimento, tipoTaxa, irEstimado, isIsentoIR]);

  // Atualiza o campo de valor atual com o calculo automatico
  useEffect(() => {
    const valorAtualInput = document.getElementById("valorAtual") as HTMLInputElement | null;
    if (!valorAtualInput) return;

    const hasInputs = Boolean(valorInvestido || dataCompra || dataVencimento || taxaContratada || percentualCdi || ipcaTaxa);
    if (!hasInputs) {
      valorAtualInput.value = "";
      return;
    }

    const valorAtual = calcularValorAtualRendaFixa({
      valorInvestido,
      tipoTaxa,
      taxaContratada,
      percentualCdi,
      cdiAtual: "10.65",
      ipcaTaxa,
      dataCompra,
      dataVencimento,
    });

    valorAtualInput.value = formatValue(valorAtual);
  }, [valorInvestido, taxaContratada, percentualCdi, ipcaTaxa, dataCompra, dataVencimento, tipoTaxa]);

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
          type="number"
          inputMode="decimal"
          placeholder="Taxa anual (%)"
          maxLength={3}
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
        <>
          <AlertBox type="success">
            <span className="text-xs font-medium">Isento de IR</span>
          </AlertBox>
          <input type="hidden" id="irEstimado" name="irEstimado" value="0" />
        </>
      ) : isManualIR ? (
        <InputField
          id="irEstimado"
          name="irEstimado"
          label="IR estimado (%)"
          icon={faPercent}
          type="text"
          inputMode="decimal"
          placeholder="15% a 22,5%"
        />
      ) : (
        <>
          <div className="space-y-1">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50">
              <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
              <label className="text-sm text-gray-600 whitespace-nowrap">IR estimado (%)</label>
              <input
                type="text"
                className="w-full bg-transparent outline-none text-right"
                value={irEstimado ? `${irEstimado}%` : "Calculando..."}
                readOnly
              />
            </div>
          </div>
          <input type="hidden" id="irEstimado" name="irEstimado" value={irEstimado} />
        </>
      )}

      <RiskSelectField
        id="categoriaRiscoRendaFixa"
        name="categoriaRiscoRendaFixa"
        label="Nível de risco"
        options={riscoOptions}
        defaultValue=""
      />

      <div className="space-y-1">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50">
          <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
          <label className="text-sm text-gray-600 whitespace-nowrap">Valor líquido estimado</label>
          <input
            type="text"
            className="w-full bg-transparent outline-none text-right"
            value={valorFinalEstimado || "Calculando..."}
            readOnly
          />
        </div>
      </div>
      <input type="hidden" id="valorFinalEstimado" name="valorFinalEstimado" value={valorFinalEstimado} />
    </>
  );
}