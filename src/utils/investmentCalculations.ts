import { EXEMPT_IR_FIXED_INCOME } from "../const/ativos";

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
  
  // Remove tudo exceto dígitos, vírgula, ponto e hífen
  let normalized = String(value).replace(/[^\d,.-]/g, "");
  
  // Se tem vírgula, é formato brasileiro: 1.000,50
  if (normalized.includes(",")) {
    // Remove pontos (separador de milhar brasileiro)
    normalized = normalized.replace(/\./g, "");
    // Substitui vírgula por ponto (decimal brasileiro -> padrão)
    normalized = normalized.replace(",", ".");
  } else if (normalized.includes(".")) {
    // Se tem ponto, verificar se é decimal ou separador de milhar
    const lastDotIndex = normalized.lastIndexOf(".");
    const digitsAfterDot = normalized.length - lastDotIndex - 1;
    
    // Se tem 1-2 dígitos após o ponto, é decimal (10.65)
    // Se tem 3+ dígitos ou 0 dígitos, é separador de milhar (1.000)
    if (digitsAfterDot === 3 || digitsAfterDot === 0) {
      // É separador de milhar, remover todos os pontos
      normalized = normalized.replace(/\./g, "");
    }
    // Senão, manter o ponto como decimal
  }
  
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
    taxaEfetiva = toNumber(input.taxaContratada) / 100;
  } else if (tipoTaxa === "pos_fixado_cdi") {
    const cdiAtual = toNumber(input.cdiAtual);
    const percentualCdi = toNumber(input.percentualCdi);
    // Taxa efetiva = (CDI% × Percentual%) / 10000 para obter decimal
    // Ex: (10,65 × 110) / 10000 = 0,11715 (11,715%)
    taxaEfetiva = (cdiAtual * percentualCdi) / 10000;
  } else if (tipoTaxa === "ipca") {
    const ipcaTaxa = toNumber(input.ipcaTaxa);
    // ipcaTaxa já vem como taxa composta (IPCA + Taxa fixa calculado com fórmula composta)
    taxaEfetiva = ipcaTaxa / 100;
  }

  const valorAtual = valorInvestido * Math.pow(1 + taxaEfetiva, anos);
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

/**
 * Calcula a alíquota de IR baseada no número de dias entre duas datas
 * @param dataInicio - Data de início em formato string (YYYY-MM-DD)
 * @param dataFim - Data de término em formato string (YYYY-MM-DD)
 * @returns Taxa de IR em percentual
 */
export const calcularAliquotaIR = (dataInicio: string, dataFim: string): number => {
  if (!dataInicio || !dataFim) return 15; // valor padrão

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const diffTime = Math.abs(fim.getTime() - inicio.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 180) return 22.5;
  if (diffDays <= 360) return 20;
  if (diffDays <= 720) return 17.5;
  return 15;
};

/**
 * Verifica se um tipo de renda fixa é isento de IR
 * @param tipoAtivoRendaFixa - Tipo do ativo de renda fixa
 * @param tipoDebenture - Tipo de debenture (se aplicável)
 * @returns true se isento, false caso contrário
 */
export const isRendaFixaIsentaIR = (
  tipoAtivoRendaFixa: string,
  tipoDebenture?: string
): boolean => {
  if (EXEMPT_IR_FIXED_INCOME.includes(tipoAtivoRendaFixa)) {
    return true;
  }
  if (tipoAtivoRendaFixa === "debenture" && tipoDebenture === "incentivada") {
    return true;
  }
  return false;
};

/**
 * Verifica se o IR deve ser manual (digitado pelo usuário)
 * @param tipoAtivoRendaFixa - Tipo do ativo de renda fixa
 * @returns true se manual, false caso contrário
 */
export const isIRManual = (tipoAtivoRendaFixa: string): boolean => {
  return tipoAtivoRendaFixa === "outros";
};

/**
 * Calcula o número de anos entre duas datas
 * @param dataInicio - Data de início em formato string (YYYY-MM-DD)
 * @param dataFim - Data de término em formato string (YYYY-MM-DD)
 * @returns Número de anos
 */
export const calcularAnos = (dataInicio: string, dataFim: string): number => {
  if (!dataInicio || !dataFim) return 0;

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const diffTime = Math.abs(fim.getTime() - inicio.getTime());
  return diffTime / (1000 * 60 * 60 * 24 * 365);
};

/**
 * Calcula rendimento bruto com base no tipo de taxa
 * @param valor - Valor inicial do investimento
 * @param taxa - Taxa de rendimento (em decimal ou percentual dependendo do tipo)
 * @param anos - Número de anos
 * @param tipoTaxa - Tipo da taxa: 'prefixado', 'pos_fixado_cdi', 'ipca'
 * @param parametrosAdicionais - Parâmetros adicionais (percentualCdi, ipcaTaxa, etc)
 * @returns Rendimento bruto calculado
 */
export const calcularRendimentoBruto = (
  valor: number,
  taxa: number,
  anos: number,
  tipoTaxa: string,
  parametrosAdicionais: Record<string, number> = {}
): number => {
  if (tipoTaxa === "prefixado") {
    return valor * Math.pow(1 + taxa / 100, anos);
  }

  if (tipoTaxa === "pos_fixado_cdi") {
    const { cdiAtual = 10.65, percentualCdi = 100 } = parametrosAdicionais;
    // Taxa efetiva = (CDI% × Percentual%) / 10000 para obter decimal
    // Ex: (10,65 × 110) / 10000 = 0,11715 (11,715%)
    const taxaEfetiva = (cdiAtual * percentualCdi) / 10000;
    return valor * Math.pow(1 + taxaEfetiva, anos);
  }

  if (tipoTaxa === "ipca") {
    const { ipcaTaxa = 0 } = parametrosAdicionais;
    // ipcaTaxa já vem como taxa composta calculada no TaxaSection
    // Exemplo: IPCA 4.8% + Taxa fixa 5% = 10.04% (composto)
    return valor * Math.pow(1 + ipcaTaxa / 100, anos);
  }

  return valor;
};

/**
 * Calcula valor final líquido de um investimento de renda fixa
 * @param valorBruto - Valor bruto calculado
 * @param valorInvestido - Valor inicialmente investido
 * @param aliquotaIR - Alíquota de IR em percentual
 * @param isIsentoIR - Se o investimento é isento de IR
 * @returns Valor final líquido
 */
export const calcularValorLiquidoRendaFixa = (
  valorBruto: number,
  valorInvestido: number,
  aliquotaIR: number,
  isIsentoIR: boolean
): number => {
  const rendimento = valorBruto - valorInvestido;

  let valorIR = 0;
  if (!isIsentoIR && aliquotaIR > 0) {
    valorIR = rendimento * (aliquotaIR / 100);
  }

  const valorLiquido = valorBruto - valorIR;
  // Arredondar para 2 casas decimais
  return Math.round(valorLiquido * 100) / 100;
};
