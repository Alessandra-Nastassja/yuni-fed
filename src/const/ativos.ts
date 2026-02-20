type Option = { value: string; label: string };

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
