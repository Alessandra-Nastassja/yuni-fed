type Option = { value: string; label: string };

// ============================================
// CONSTANTES DO SISTEMA DE ATIVOS
// ============================================

// Mapeamento de tipos de ativos para categorias de risco
export const RISK_LEVELS_BY_INVESTMENT_TYPE = {
  tesouro_direto: "low",
  renda_fixa_lci_lca_cri_cra: "low",
  renda_fixa_cdb_lc: "low_medium",
  renda_fixa_debenture: "medium_high",
  renda_variavel_acoes: "medium_high",
  renda_variavel_fii: "low_medium",
} as const;

// Ativos que são isentos de IR
export const EXEMPT_IR_FIXED_INCOME = ["lci", "lca", "cri", "cra"];

// Constantes de IR baseadas em dias
export const IR_RATES_BY_DAYS = {
  low: { maxDays: 180, rate: 22.5 },
  medium: { maxDays: 360, rate: 20 },
  high: { maxDays: 720, rate: 17.5 },
  veryHigh: { maxDays: Infinity, rate: 15 },
} as const;

// IDs de inputs de moeda (necessários para aplicar máscara)
export const MONEY_INPUT_IDS = {
  tesouro: ["valorInvestido"] as string[],
  rendaFixa: ["valorInvestido", "cdiAtual"] as string[],
  rendaVariavel: ["precoMedio", "precoAtual", "dividendosRecebidos", "dividendYield"] as string[],
};

// IDs de inputs de data (necessários para capturar mudanças)
export const DATE_INPUT_IDS = {
  dataCompra: "dataCompra",
  dataVencimento: "dataVencimento",
} as const;

// Alertas padrão
export const ALERT_MESSAGES = {
  createSuccess: (nome: string, tipo: string) => `"${nome}" (${tipo}) criado com sucesso!`,
  createError: "Erro ao criar ativo. Tente novamente.",
  fetchError: "Erro ao buscar ativos.",
  missingFields: "Por favor, preencha todos os campos obrigatórios.",
} as const;

// Timers
export const TIMERS = {
  loadingDelay: 1500,
  inputMaskDelay: 0,
} as const;

// Rotas da API
export const API_ENDPOINTS = {
  ativos: "/ativos",
  ativosCompleto: "/ativos/completo",
} as const;

// Tipos de abordagem para cálculo de valor final (Renda Fixa)
export const FIXED_INCOME_RATE_TYPES = {
  prefixado: "prefixado",
  posFiXadoCdi: "pos_fixado_cdi",
  ipca: "ipca",
} as const;

// TODO: integração com mercado (B3, Api de mercado ou último fechamento)
// Constantes de índices (esses podem ser atualizados periodicamente)
export const INDICES = {
  cdiAtual: 10.65,
  ipcaAproximado: 4.80,
} as const;

// Tipos de investimento por categoria
export const INVESTMENT_SUBTYPES = {
  acoes: "acoes",
  fii: "fii",
  etf: "etf",
} as const;

// Labels formatados para tipos de renda variável
export const RENDA_VARIAVEL_TIPO_LABELS: Record<string, string> = {
  acoes: "Ações",
  fii: "FII",
  etf: "ETF",
};

// Condições para mostrar campos na Renda Variável
export const RENDA_VARIAVEL_CONDITIONS = {
  acoes: {
    shouldShowDataCompra: true,
    shouldShowDividendosRecebidos: true,
    shouldShowIRSelect: true,
  },
  fii: {
    shouldShowDividendYield: true,
    shouldShowIRInput: true,
  },
  etf: {
    shouldShowIRSelect: true,
  },
} as const;

// Descrições padrão para renda variável
export const RENDA_VARIAVEL_DESCRIPTIONS = {
  acoes: {
    irOptions: [
      { value: "15", label: "15% (normal)" },
      { value: "20", label: "20% (day trade)" },
    ],
  },
  etf: {
    irOptions: [
      { value: "15", label: "15% (normal)" },
      { value: "20", label: "20% (day trade)" },
    ],
  },
} as const;

// Classe CSS padrão para input de moeda
export const MONEY_INPUT_CLASS = "flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm";

// Classe CSS padrão para input desabilitado
export const DISABLED_INPUT_CLASS = "flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50";

// ============================================
// OPÇÕES DE SELEÇÃO
// ============================================

export const ATIVOS_TIPO_OPTIONS: Option[] = [
  { value: "conta_corrente", label: "Conta corrente" },
  { value: "meu_negocio", label: "Meu negócio" },
  { value: "investimentos", label: "Investimentos" },
  { value: "contas_a_receber", label: "Contas a receber" },
  { value: "reserva_emergencia", label: "Reserva de emergência" },
  { value: "previdencia_privada", label: "Previdência privada" },
  { value: "outros", label: "Outros" },
];

export const ATIVOS_FONTE_RENDA_OPTIONS: Option[] = [
  { value: "fonte_renda-1", label: "Fonte de renda 1" },
  { value: "fonte_renda-2", label: "Fonte de renda 2" },
  { value: "outros", label: "Outros" },
];

export const CONTAS_A_RECEBER_CATEGORIA_OPTIONS: Option[] = [
  { value: "dividendos", label: "Dividendos" },
  { value: "jcp", label: "JCP" },
  { value: "rendimento", label: "Rendimento" },
  { value: "proventos", label: "Proventos" },
  { value: "outros", label: "Outros" },
];

export const BANCOS_OPTIONS: Option[] = [
  { value: "nubank", label: "Nubank" },
  { value: "inter", label: "Inter" },
  { value: "itau", label: "Itaú" },
  { value: "bradesco", label: "Bradesco" },
  { value: "banco_do_brasil", label: "Banco do Brasil" },
  { value: "santander", label: "Santander" },
  { value: "caixa", label: "Caixa Econômica Federal" },
  { value: "c6_bank", label: "C6 Bank" },
  { value: "original", label: "Banco Original" },
  { value: "safra", label: "Banco Safra" },
  { value: "btg_pactual", label: "BTG Pactual" },
  { value: "picpay", label: "PicPay" },
  { value: "neon", label: "Neon" },
  { value: "next", label: "Next" },
  { value: "mercado_pago", label: "Mercado Pago" },
  { value: "outros", label: "Outros" },
];

export const CORRETORAS_OPTIONS: Option[] = [
  { value: "xp", label: "XP Investimentos" },
  { value: "btg_pactual", label: "BTG Pactual" },
  { value: "rico", label: "Rico" },
  { value: "clear", label: "Clear" },
  { value: "inter", label: "Inter" },
  { value: "nubank", label: "Nubank" },
  { value: "ativa", label: "Ativa Investimentos" },
  { value: "modal", label: "Modal" },
  { value: "warren", label: "Warren" },
  { value: "easynvest", label: "Easynvest" },
  { value: "c6_bank", label: "C6 Bank" },
  { value: "itau", label: "Itaú" },
  { value: "bradesco", label: "Bradesco" },
  { value: "santander", label: "Santander" },
  { value: "banco_do_brasil", label: "Banco do Brasil" },
  { value: "tesouro_direto", label: "Tesouro Direto" },
  { value: "outros", label: "Outros" },
];

export const ATIVOS_CATEGORIA_INVESTIMENTO_OPTIONS: Option[] = [
  { value: "tesouro_direto", label: "Tesouro direto" },
  { value: "renda_fixa", label: "Renda fixa" },
  { value: "renda_variavel", label: "Renda variável" },
  { value: "outros", label: "Outros" },
];

export const RISCO_BAIXO: Option[] = [
  { value: "baixo", label: "Baixo" },
];

export const RISCO_BAIXO_MEDIO: Option[] = [
  { value: "baixo", label: "Baixo" },
  { value: "medio", label: "Médio" },
];

export const RISCO_MEDIO_ALTO: Option[] = [
  { value: "medio", label: "Médio" },
  { value: "alto", label: "Alto" },
];

export const RISCO_BAIXO_MEDIO_ALTO: Option[] = [
  { value: "baixo", label: "Baixo" },
  { value: "medio", label: "Médio" },
  { value: "alto", label: "Alto" },
];

export const TESOURO_TIPO_OPTIONS: Option[] = [
  { value: "tesouro_selic", label: "Tesouro Selic" },
  { value: "tesouro_ipca", label: "IPCA+" },
  { value: "tesouro_prefixado", label: "Prefixado" },
];

export const RENDA_FIXA_TIPO_ATIVO_OPTIONS: Option[] = [
  { value: "cdb", label: "CDB" },
  { value: "lci", label: "LCI" },
  { value: "lca", label: "LCA" },
  { value: "lc", label: "LC" },
  { value: "cri", label: "CRI" },
  { value: "cra", label: "CRA" },
  { value: "debenture", label: "Debenture" },
  { value: "outros", label: "Outros" },
];

export const DEBENTURE_TIPO_OPTIONS: Option[] = [
  { value: "comum", label: "Comum" },
  { value: "incentivada", label: "Incentivada" },
];

export const TAXA_TIPO_OPTIONS: Option[] = [
  { value: "prefixado", label: "Prefixado" },
  { value: "pos_fixado_cdi", label: "% CDI" },
  { value: "ipca", label: "IPCA + taxa" },
];

export const NAO_ATIVOS_TIPO_OPTIONS: Option[] = [
  { value: "veiculos", label: "Veículos" },
  { value: "imoveis", label: "Imóveis" },
  { value: "fgts", label: "FGTS" },
  { value: "objeto_de_valor", label: "Objeto de Valor" },
  { value: "outros", label: "Outros" },
];
