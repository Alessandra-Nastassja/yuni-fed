type DateInput = string | Date | undefined | null;

type TesouroDiretoInput = {
  valorInvestido?: number | string | null;
  taxaRentabilidade?: number | string | null;
  dataCompra?: DateInput;
  dataVencimento?: DateInput;
};

type RendaFixaInput = {
  valorInvestido?: number | string | null;
  tipoTaxa?: string | null;
  taxaContratada?: number | string | null;
  percentualCdi?: number | string | null;
  cdiAtual?: number | string | null;
  ipcaTaxa?: number | string | null;
  ipcaAcumulado?: number | string | null;
  dataCompra?: DateInput;
  dataVencimento?: DateInput;
};

type RendaVariavelInput = {
  quantidade?: number | string | null;
  precoAtualMercado?: number | string | null;
  dataCompra?: DateInput;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const toNumber = (value: number | string | null | undefined) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const normalized = String(value).replace(/[^\d,.-]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toDate = (value: DateInput) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const round2 = (value: number) => Math.round(value * 100) / 100;

const clampNonNegative = (value: number) => (value < 0 ? 0 : value);

const resolveReferenceDate = (dataCompra: DateInput, dataVencimento: DateInput) => {
  const compra = toDate(dataCompra);
  const vencimento = toDate(dataVencimento);
  const hoje = new Date();

  if (!compra) return null;
  if (hoje < compra) return { compra, referencia: compra, antesDaCompra: true };

  const referencia = vencimento && hoje > vencimento ? vencimento : hoje;
  return { compra, referencia, antesDaCompra: false };
};

const calcularAnosDecorridos = (dataCompra: DateInput, dataReferencia: DateInput) => {
  const compra = toDate(dataCompra);
  const ref = toDate(dataReferencia);
  if (!compra || !ref) return 0;
  const dias = (ref.getTime() - compra.getTime()) / MS_PER_DAY;
  return dias / 365;
};

export const calcularValorAtualTesouroDireto = (input: TesouroDiretoInput) => {
  const valorInvestido = toNumber(input.valorInvestido);
  const taxa = toNumber(input.taxaRentabilidade);
  const ref = resolveReferenceDate(input.dataCompra, input.dataVencimento);

  if (!ref || ref.antesDaCompra) return round2(clampNonNegative(valorInvestido));

  const anos = calcularAnosDecorridos(ref.compra, ref.referencia);
  const valorAtual = valorInvestido * Math.pow(1 + taxa / 100, anos);
  return round2(clampNonNegative(valorAtual));
};

export const calcularValorAtualRendaFixa = (input: RendaFixaInput) => {
  const valorInvestido = toNumber(input.valorInvestido);
  const tipoTaxa = input.tipoTaxa ?? "";
  const ref = resolveReferenceDate(input.dataCompra, input.dataVencimento);

  if (!ref || ref.antesDaCompra) return round2(clampNonNegative(valorInvestido));

  const anos = calcularAnosDecorridos(ref.compra, ref.referencia);

  let taxaEfetiva = 0;
  if (tipoTaxa === "prefixado") {
    taxaEfetiva = toNumber(input.taxaContratada);
  } else if (tipoTaxa === "pos_fixado_cdi") {
    const cdiAtual = toNumber(input.cdiAtual);
    const percentualCdi = toNumber(input.percentualCdi);
    taxaEfetiva = (cdiAtual * percentualCdi) / 100;
  } else if (tipoTaxa === "ipca") {
    const ipcaAcumulado = toNumber(input.ipcaAcumulado);
    const ipcaTaxa = toNumber(input.ipcaTaxa);
    taxaEfetiva = ipcaAcumulado > 0 ? ipcaAcumulado + ipcaTaxa : ipcaTaxa;
  }

  const valorAtual = valorInvestido * Math.pow(1 + taxaEfetiva / 100, anos);
  return round2(clampNonNegative(valorAtual));
};

export const calcularValorAtualRendaVariavel = (input: RendaVariavelInput) => {
  const quantidade = toNumber(input.quantidade);
  const precoAtual = toNumber(input.precoAtualMercado);
  const valorAtual = quantidade * precoAtual;
  return round2(clampNonNegative(valorAtual));
};

export const calcularValorFinalEstimadoRendaFixa = (params: {
  valorAtual: number;
  valorInvestido: number;
  dataCompra?: DateInput;
  dataVencimento?: DateInput;
  isento?: boolean;
}) => {
  const { valorAtual, valorInvestido, dataCompra, dataVencimento, isento } = params;
  if (valorAtual <= 0 || valorInvestido <= 0) return 0;
  if (isento) return round2(clampNonNegative(valorAtual));

  const compra = toDate(dataCompra);
  const vencimento = toDate(dataVencimento);
  if (!compra || !vencimento) return round2(clampNonNegative(valorAtual));

  const dias = Math.ceil((vencimento.getTime() - compra.getTime()) / MS_PER_DAY);
  let aliquota = 15;
  if (dias <= 180) aliquota = 22.5;
  else if (dias <= 360) aliquota = 20;
  else if (dias <= 720) aliquota = 17.5;

  const rendimento = valorAtual - valorInvestido;
  const imposto = rendimento > 0 ? rendimento * (aliquota / 100) : 0;
  const valorFinal = valorAtual - imposto;
  return round2(clampNonNegative(valorFinal));
};
