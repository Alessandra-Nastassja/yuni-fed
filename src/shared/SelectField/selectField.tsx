import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SelectFieldProps extends Omit<FieldProps, 'type'> {
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
}

interface FieldProps {
  id: string;
  name: string;
  label: string;
  icon: IconDefinition;
  type?: string;
  inputMode?: string;
  placeholder?: string;
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
}

export default function SelectField({ id, name, label, icon, options, onChange, defaultValue = "", value }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
        <FontAwesomeIcon icon={icon} className="text-gray-400" />
        <label className="text-gray-600 whitespace-nowrap" htmlFor={id}>{label}</label>
        <select
          id={id}
          name={name}
          className="w-full bg-transparent outline-none"
          {...(value !== undefined ? { value } : { defaultValue })}
          onChange={(event) => onChange?.(event.target.value)}
        >
          <option value="" disabled>Selecione</option>
          {options.map((option) => (
            <option className="text-medium" key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}