import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FieldProps {
  id: string;
  name: string;
  label: string;
  icon: IconDefinition;
  type?: string;
  inputMode?: "search" | "decimal" | "text" | "email" | "tel" | "url" | "numeric" | "none";
  placeholder?: string;
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({ id, name, label, icon, type = "text", inputMode, placeholder, maxLength, readOnly, disabled, value, onChange }: FieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
        <FontAwesomeIcon icon={icon} className="text-gray-400" />
        <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor={id}>{label}</label>
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode as "search" | "decimal" | "text" | "email" | "tel" | "url" | "numeric" | "none" | undefined}
          className="w-full bg-transparent outline-none text-right"
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={disabled}
          {...(value !== undefined ? { value, onChange } : {})}
        />
      </div>
    </div>
  );
}
