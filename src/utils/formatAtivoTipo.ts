import { ATIVOS_TIPO_OPTIONS } from "../const/ativos";

export const formatTipoAtivo = (tipo: string): string => {
  const option = ATIVOS_TIPO_OPTIONS.find(opt => opt.value === tipo);
  return option ? option.label : tipo;
};
