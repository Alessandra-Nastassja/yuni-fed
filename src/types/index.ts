// Tipos para opções de select
export interface SelectOption {
  value: string;
  label: string;
}

// Props dos componentes de forma
export interface RiskSelectFieldProps {
  id: string;
  name: string;
  label: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  defaultValue?: string;
}

export interface RendaFixaFormProps {
  riscoOptions: SelectOption[];
}

export interface RendaVariavelFormProps {
  riscoOptions: SelectOption[];
  onChange?: (data: any) => void;
}

export interface TesouroDiretoFormProps {
  riscoOptions?: SelectOption[];
}
