import { useCallback, useState } from "react";
import { faBuildingColumns, faDollarSign, faPercent, faTag } from "@fortawesome/free-solid-svg-icons";

import SelectField from "@shared/SelectField/selectField";
import InputField from "@shared/InputField/inputField";
import { ReadOnlyField } from "@shared/ReadOnlyField/ReadOnlyField";
import { BANCOS_OPTIONS, INDICES } from "@const/ativos";
import { useMoneyMask, useInputValueListener } from "../../../../../hooks";
import { parseMoneyString, formatValue } from "@utils/currency";
import { calcularReservaEmergencia } from "@utils/investmentCalculations";

export function ReservaDeEmergenciaForm() {
  const [bancoSelecionado, setBancoSelecionado] = useState("");
  const [irEstimado, setIrEstimado] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [valorLiquidoEstimado, setValorLiquidoEstimado] = useState("");

  useMoneyMask(["valorInvestido"]);

  const calcularValores = useCallback((values: Record<string, string>) => {
    const valorInvestido = parseMoneyString(values.valorInvestido || "");
    const percentualCdi = parseFloat((values.percentualCdi || "").replace(",", "."));
    const dataAporte = values.dataCompra || "";

    if (!valorInvestido || !percentualCdi || !dataAporte) {
      setIrEstimado("");
      setValorAtual("");
      setValorLiquidoEstimado("");
      return;
    }

    const resultados = calcularReservaEmergencia(
      valorInvestido,
      percentualCdi,
      INDICES.cdiAtual,
      dataAporte
    );

    setIrEstimado(String(resultados.aliquotaIR));
    setValorAtual(formatValue(resultados.valorAtual));
    setValorLiquidoEstimado(formatValue(resultados.valorLiquido));
  }, []);

  useInputValueListener(
    ["valorInvestido", "percentualCdi", "dataCompra"],
    calcularValores
  );

  return (
    <>
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

      {['nubank', 'picpay', 'pag_seguro'].includes(bancoSelecionado) && (
        <>
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

          <ReadOnlyField
            icon={faPercent}
            label="CDI atual"
            value={`${INDICES.cdiAtual.toFixed(2)}% a.a`}
            isSkeleton={false}
          />
          <input type="hidden" id="cdi" name="cdi" value={INDICES.cdiAtual.toFixed(2)} />
        
          <InputField
            id="dataCompra"
            name="dataCompra"
            label="Data do aporte"
            icon={faTag}
            type="date"
          />

          <ReadOnlyField
            icon={faDollarSign}
            label="Valor atual (se resgatar hoje) (R$)"
            value={valorAtual}
            isSkeleton={false}
          />

          <ReadOnlyField
            icon={faPercent}
            label="IR (se resgatar hoje) (%)"
            value={irEstimado ? `${irEstimado}%` : ""}
            isSkeleton={false}
          />

          <ReadOnlyField
            icon={faDollarSign}
            label="Valor líquido (se resgatar hoje) (R$)"
            value={valorLiquidoEstimado}
            isSkeleton={false}
          />
        </>
      )}

      {['nubank', 'picpay', 'pag_seguro'].includes(bancoSelecionado) === false && (
        <InputField
            id="valorInvestido"
            name="valorInvestido"
            label="Valor atual (R$)"
            icon={faDollarSign}
            type="text"
            inputMode="decimal"
            placeholder="R$ 0,00"
          />
      )}
    </>
  );
}
