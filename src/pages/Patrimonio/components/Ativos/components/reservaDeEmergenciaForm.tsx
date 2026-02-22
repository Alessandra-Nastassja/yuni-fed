import { useCallback, useState } from "react";
import { faBuildingColumns, faDollarSign, faPercent, faTag } from "@fortawesome/free-solid-svg-icons";

import SelectField from "@shared/SelectField/selectField";
import InputField from "@shared/InputField/inputField";
import { ReadOnlyField } from "@shared/ReadOnlyField/ReadOnlyField";
import { BANCOS_OPTIONS, INDICES } from "@const/ativos";
import { useMoneyMask, useInputValueListener } from "../../../../../hooks";
import { parseMoneyString, formatValue } from "@utils/currency";
import { calcularAliquotaIR, calcularValorAtualRendaFixa, calcularValorFinalEstimadoRendaFixa } from "@utils/investmentCalculations";

export function ReservaDeEmergenciaForm() {
  const [bancoSelecionado, setBancoSelecionado] = useState("");
  const [irEstimado, setIrEstimado] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [valorLiquidoEstimado, setValorLiquidoEstimado] = useState("");

  useMoneyMask(["valorInvestido"]);

  const calcularValores = useCallback((values: Record<string, string>) => {
    const valorInvestido = parseMoneyString(values.valorInvestido || "");
    const percentualCdi = parseFloat((values.percentualCdi || "").replace(",", "."));
    const dataCompra = values.dataCompra || "";
    const dataVencimento = values.dataVencimento || "";

    if (!valorInvestido || !percentualCdi || !dataCompra || !dataVencimento) {
      setIrEstimado("");
      setValorAtual("");
      setValorLiquidoEstimado("");
      return;
    }

    const aliquota = calcularAliquotaIR(dataCompra, dataVencimento);
    setIrEstimado(String(aliquota));

    const valorAtualCalculado = calcularValorAtualRendaFixa({
      valorInvestido,
      tipoTaxa: "pos_fixado_cdi",
      percentualCdi,
      cdiAtual: INDICES.cdiAtual,
      dataCompra,
      dataVencimento,
    });

    setValorAtual(formatValue(valorAtualCalculado));

    const valorLiquido = calcularValorFinalEstimadoRendaFixa({
      valorAtual: valorAtualCalculado,
      valorInvestido,
      dataCompra,
      dataVencimento,
      isento: false,
    });

    setValorLiquidoEstimado(formatValue(valorLiquido));
  }, []);

  useInputValueListener(
    ["valorInvestido", "percentualCdi", "dataCompra", "dataVencimento"],
    calcularValores
  );

  return (
    <>
      <InputField
        id="nome"
        name="nome"
        label="Nome"
        icon={faTag}
        placeholder="Digite o nome"
        maxLength={50}
      />

      <SelectField
        id="banco"
        name="banco"
        label="Banco"
        icon={faBuildingColumns}
        options={BANCOS_OPTIONS}
        onChange={(value) => setBancoSelecionado(value)}
        defaultValue=""
      />

      {bancoSelecionado === "outros" && (
        <InputField
          id="bancoCustomizado"
          name="bancoCustomizado"
          label="Nome do banco"
          icon={faBuildingColumns}
          placeholder="Digite o nome do banco"
          maxLength={50}
        />
      )}

      <InputField
        id="valorInvestido"
        name="valorInvestido"
        label="Valor investido (R$)"
        icon={faDollarSign}
        type="text"
        inputMode="decimal"
        placeholder="R$ 0,00"
      />

      <InputField
        id="percentualCdi"
        name="percentualCdi"
        label="% do CDI"
        icon={faPercent}
        type="text"
        inputMode="decimal"
        placeholder="110"
      />

      <InputField
        id="cdiDisplay"
        name="cdiDisplay"
        label="CDI atual"
        icon={faPercent}
        type="text"
        placeholder="0,00% a.a"
        value={`${INDICES.cdiAtual.toFixed(2)}% a.a`}
        readOnly
      />
      <input type="hidden" id="cdi" name="cdi" value={INDICES.cdiAtual.toFixed(2)} />

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

      <ReadOnlyField
        icon={faDollarSign}
        label="Valor atual (R$)"
        value={valorAtual}
        isSkeleton={false}
      />

      <ReadOnlyField
        icon={faPercent}
        label="IR estimado (%)"
        value={irEstimado ? `${irEstimado}%` : ""}
        isSkeleton={false}
      />

      <ReadOnlyField
        icon={faDollarSign}
        label="Valor líquido estimado (R$)"
        value={valorLiquidoEstimado}
        isSkeleton={false}
      />
    </>
  );
}
