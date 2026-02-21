import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { DISABLED_INPUT_CLASS } from "../../const/ativos";

interface ReadOnlyFieldProps {
  icon: IconProp;
  label: string;
  value: string;
  isSkeleton?: boolean;
}

/**
 * Componente ReadOnlyField - Campo somente leitura com ícone
 * Usado para exibir valores calculados automaticamente
 */
export function ReadOnlyField({
  icon,
  label,
  value,
  isSkeleton = false,
}: ReadOnlyFieldProps) {
  return (
    <div className="space-y-1">
      <div className={DISABLED_INPUT_CLASS}>
        <FontAwesomeIcon icon={icon} className="text-gray-400" />
        <label className="text-sm text-gray-600 whitespace-nowrap">{label}</label>
        <input
          type="text"
          className="w-full bg-transparent outline-none text-right"
          value={isSkeleton ? "Calculando..." : value}
          readOnly
        />
      </div>
    </div>
  );
}
