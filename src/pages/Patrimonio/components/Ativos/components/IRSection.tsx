import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
import InputField from "../../../../../shared/InputField/inputField";
import AlertBox from "../../../../../shared/Alert/AlertBox";
import { DISABLED_INPUT_CLASS } from "../../../../../const/ativos";
import { isRendaFixaIsentaIR, isIRManual } from "../../../../../utils/investmentCalculations";

interface IRSectionProps {
  tipoAtivo: string;
  tipoDebenture?: string;
  irEstimado: string;
  onIRChange: (value: string) => void;
}

/**
 * Componente IRSection - Seção para gerenciar IR de Renda Fixa
 * Mostra campos diferentes dependendo do tipo de ativo
 */
export function IRSection({
  tipoAtivo,
  tipoDebenture,
  irEstimado,
  onIRChange,
}: IRSectionProps) {
  const isIsento = isRendaFixaIsentaIR(tipoAtivo, tipoDebenture);
  const isManual = isIRManual(tipoAtivo);

  if (isIsento) {
    return (
      <>
        <AlertBox type="success">
          <span className="text-xs font-medium">Isento de IR</span>
        </AlertBox>
        <input type="hidden" id="irEstimado" name="irEstimado" value="0" />
      </>
    );
  }

  if (isManual) {
    return (
      <InputField
        id="irEstimado"
        name="irEstimado"
        label="IR estimado (%)"
        icon={faPercent}
        type="text"
        inputMode="decimal"
        placeholder="15% a 22,5%"
        value={irEstimado}
        onChange={(e) => onIRChange(e.target.value)}
      />
    );
  }

  return (
    <>
      <div className="space-y-1">
        <div className={DISABLED_INPUT_CLASS}>
          <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
          <label className="text-sm text-gray-600 whitespace-nowrap">
            IR estimado (%)
          </label>
          <input
            type="text"
            className="w-full bg-transparent outline-none text-right"
            value={irEstimado ? `${irEstimado}%` : "Calculando..."}
            readOnly
          />
        </div>
      </div>
      <input
        type="hidden"
        id="irEstimado"
        name="irEstimado"
        value={irEstimado}
      />
    </>
  );
}
