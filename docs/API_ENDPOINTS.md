# API - Endpoints e Exemplos

Documentação completa dos endpoints da API YUNI.

**Base URL**: `http://localhost:8080`

## 📋 Índice

- [Ativos Simples](#ativos-simples)
- [Ativos Completos](#ativos-completos)
- [Metas](#metas)

---

## Ativos Simples

API para gestão básica de ativos (conta corrente, negócio próprio, etc.).

### Listar Todos os Ativos

```bash
curl -X GET http://localhost:8080/api/ativos \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "ativos": [
    {
      "id": 1,
      "nome": "Conta Corrente",
      "tipo": "conta_corrente",
      "valorAtual": 5000.00
    },
    {
      "id": 2,
      "nome": "Reserva de Emergência",
      "tipo": "reserva_emergencia",
      "valorAtual": 15000.00
    }
  ]
}
```

### Obter Ativo por ID

```bash
curl -X GET http://localhost:8080/api/ativos/1 \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "ativos": [
    {
      "id": 1,
      "nome": "Conta Corrente",
      "tipo": "conta_corrente",
      "valorAtual": 5000.00
    }
  ]
}
```

### Criar Ativo

```bash
curl -X POST http://localhost:8080/api/ativos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Conta Corrente",
    "tipo": "conta_corrente",
    "valorAtual": 5000.00
  }'
```

**Tipos válidos:**
- `conta_corrente`
- `meu_negocio`
- `investimentos`
- `contas_a_receber`
- `reserva_emergencia`
- `previdencia_privada`
- `outros`

**Response:**
```json
{
  "ativos": [
    {
      "id": 1,
      "nome": "Conta Corrente",
      "tipo": "conta_corrente",
      "valorAtual": 5000.00
    }
  ]
}
```

### Criar Múltiplos Ativos (Lote)

```bash
curl -X POST http://localhost:8080/api/ativos/lote \
  -H "Content-Type: application/json" \
  -d '{
    "ativos": [
      {
        "nome": "Conta Corrente",
        "tipo": "conta_corrente",
        "valorAtual": 5000.00
      },
      {
        "nome": "Poupança",
        "tipo": "reserva_emergencia",
        "valorAtual": 10000.00
      }
    ]
  }'
```

### Atualizar Ativo

```bash
curl -X PUT http://localhost:8080/api/ativos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Conta Corrente Atualizada",
    "tipo": "conta_corrente",
    "valorAtual": 6000.00
  }'
```

### Deletar Ativo

```bash
curl -X DELETE http://localhost:8080/api/ativos/1 \
  -H "Content-Type: application/json"
```

**Response:** `204 No Content`

---

## Ativos Completos

API para gestão detalhada de investimentos (Tesouro Direto, Renda Fixa, Renda Variável).

### Criar Ativo com Tesouro Direto

```bash
curl -X POST http://localhost:8080/api/ativos/completo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Tesouro Selic 2027",
    "tipo": "investimentos",
    "tipoInvestimento": "tesouro_direto",
    "tesouroDireto": {
      "tipoTesouro": "selic",
      "valorInvestido": 10000.00,
      "valorAtual": 10500.00,
      "dataCompra": "2025-01-15",
      "dataVencimento": "2027-12-31",
      "corretora": "XP Investimentos",
      "taxaRentabilidade": 5.5
    }
  }'
```

**Tipos de Tesouro:**
- `selic`
- `prefixado`
- `ipca`

**Response:**
```json
{
  "id": 1,
  "nome": "Tesouro Selic 2027",
  "tipo": "investimentos",
  "tipoInvestimento": "tesouro_direto",
  "valorAtual": 10500.00,
  "risco": "baixo",
  "tesouroDireto": {
    "id": 1,
    "tipoTesouro": "selic",
    "valorInvestido": 10000.00,
    "valorAtual": 10500.00,
    "dataCompra": "2025-01-15",
    "dataVencimento": "2027-12-31",
    "corretora": "XP Investimentos",
    "taxaRentabilidade": 5.5,
    "risco": "baixo"
  },
  "dataCriacao": "2026-02-20T10:30:00",
  "dataAtualizacao": "2026-02-20T10:30:00"
}
```

### Criar Ativo com Renda Fixa - CDB Prefixado

```bash
curl -X POST http://localhost:8080/api/ativos/completo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "CDB Banco Inter",
    "tipo": "investimentos",
    "tipoInvestimento": "renda_fixa",
    "rendaFixa": {
      "tipoAtivoRendaFixa": "cdb",
      "valorInvestido": 20000.00,
      "valorAtual": 21000.00,
      "corretora": "Banco Inter",
      "dataCompra": "2025-03-01",
      "dataVencimento": "2027-03-01",
      "tipoTaxa": "prefixado",
      "taxaContratada": 12.5,
      "categoriaRiscoRendaFixa": "baixo",
      "isento": false,
      "valorFinalEstimado": 25000.00
    }
  }'
```

### Criar Ativo com Renda Fixa - Pós-Fixado CDI

```bash
curl -X POST http://localhost:8080/api/ativos/completo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "CDB 120% CDI",
    "tipo": "investimentos",
    "tipoInvestimento": "renda_fixa",
    "rendaFixa": {
      "tipoAtivoRendaFixa": "cdb",
      "valorInvestido": 15000.00,
      "valorAtual": 15750.00,
      "corretora": "XP Investimentos",
      "dataCompra": "2025-06-01",
      "dataVencimento": "2028-06-01",
      "tipoTaxa": "pos_fixado_cdi",
      "percentualCdi": 120.0,
      "cdiAtual": 10.5,
      "categoriaRiscoRendaFixa": "baixo",
      "isento": false,
      "valorFinalEstimado": 20000.00
    }
  }'
```

### Criar Ativo com Renda Fixa - IPCA+

```bash
curl -X POST http://localhost:8080/api/ativos/completo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Debênture IPCA+ 6%",
    "tipo": "investimentos",
    "tipoInvestimento": "renda_fixa",
    "rendaFixa": {
      "tipoAtivoRendaFixa": "debenture",
      "tipoDebenture": "comum",
      "valorInvestido": 30000.00,
      "valorAtual": 32000.00,
      "corretora": "BTG Pactual",
      "dataCompra": "2024-12-01",
      "dataVencimento": "2029-12-01",
      "tipoTaxa": "ipca",
      "ipcaTaxa": 6.0,
      "categoriaRiscoRendaFixa": "medio",
      "isento": false,
      "irEstimado": 1500.00,
      "valorFinalEstimado": 42000.00
    }
  }'
```

**Tipos de Ativo Renda Fixa:**
- `cdb` - Certificado de Depósito Bancário
- `lc` - Letra de Câmbio
- `debenture` - Debênture
- `lci` - Letra de Crédito Imobiliário (isento de IR)
- `lca` - Letra de Crédito do Agronegócio (isento de IR)
- `cri` - Certificado de Recebíveis Imobiliários (isento de IR)
- `cra` - Certificado de Recebíveis do Agronegócio (isento de IR)
- `outros`

**Tipos de Taxa:**
- `prefixado` - Taxa fixa (enviar `taxaContratada`)
- `pos_fixado_cdi` - % do CDI (enviar `percentualCdi` e `cdiAtual`)
- `ipca` - IPCA + taxa (enviar `ipcaTaxa`)

**Tipos de Debênture:**
- `incentivada` - Isenta de IR
- `comum` - Com IR

### Criar Ativo com Renda Variável - Ações

```bash
curl -X POST http://localhost:8080/api/ativos/completo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "PETR4",
    "tipo": "investimentos",
    "tipoInvestimento": "renda_variavel",
    "rendaVariavel": {
      "tipoRendaVariavel": "acoes",
      "quantidade": 100,
      "precoMedio": 35.50,
      "valorAtual": 3800.00,
      "corretora": "Clear",
      "categoriaRiscoRendaVariavel": "alto",
      "dataCompra": "2025-01-10",
      "dividendosRecebidos": 200.00,
      "irEstimadoAcoes": 15
    }
  }'
```

### Criar Ativo com Renda Variável - FII

```bash
curl -X POST http://localhost:8080/api/ativos/completo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "HGLG11",
    "tipo": "investimentos",
    "tipoInvestimento": "renda_variavel",
    "rendaVariavel": {
      "tipoRendaVariavel": "fii",
      "quantidade": 50,
      "precoMedio": 160.00,
      "valorAtual": 8500.00,
      "corretora": "Rico",
      "categoriaRiscoRendaVariavel": "medio",
      "dividendYield": 8.5,
      "irEstimadoFii": "Isento em dividendos, 20% em ganho de capital"
    }
  }'
```

### Criar Ativo com Renda Variável - ETF

```bash
curl -X POST http://localhost:8080/api/ativos/completo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "IVVB11",
    "tipo": "investimentos",
    "tipoInvestimento": "renda_variavel",
    "rendaVariavel": {
      "tipoRendaVariavel": "etf",
      "quantidade": 30,
      "precoMedio": 280.00,
      "valorAtual": 8700.00,
      "corretora": "XP",
      "categoriaRiscoRendaVariavel": "medio",
      "irEstimadoEtf": 15
    }
  }'
```

**Tipos de Renda Variável:**
- `acoes` - Ações (IR: 15% ou 20%)
- `fii` - Fundos Imobiliários (IR: isento em dividendos)
- `etf` - Exchange Traded Funds (IR: 15% ou 20%)

### Criar Ativo Não-Investimento com tipoFonteRenda

```bash
curl -X POST http://localhost:8080/api/ativos/completo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Conta Salário",
    "tipo": "conta_corrente",
    "tipoFonteRenda": "CLT - Empresa X",
    "valorAtual": 8000.00
  }'
```

---

## Metas

API para gestão de metas financeiras.

### Listar Todas as Metas

```bash
curl -X GET http://localhost:8080/api/metas \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "metas": [
    {
      "id": 1,
      "descricao": "Comprar apartamento",
      "valorMeta": 500000.00,
      "valorAtual": 150000.00,
      "prazo": "2028-12-31",
      "percentualProgresso": 30.0
    }
  ]
}
```

### Obter Meta por ID

```bash
curl -X GET http://localhost:8080/api/metas/1 \
  -H "Content-Type: application/json"
```

### Criar Meta

```bash
curl -X POST http://localhost:8080/api/metas \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Comprar apartamento",
    "valorMeta": 500000.00,
    "valorAtual": 150000.00,
    "prazo": "2028-12-31"
  }'
```

**Response:**
```json
{
  "metas": [
    {
      "id": 1,
      "descricao": "Comprar apartamento",
      "valorMeta": 500000.00,
      "valorAtual": 150000.00,
      "prazo": "2028-12-31",
      "percentualProgresso": 30.0
    }
  ]
}
```

### Atualizar Meta

```bash
curl -X PUT http://localhost:8080/api/metas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Comprar apartamento atualizado",
    "valorMeta": 550000.00,
    "valorAtual": 200000.00,
    "prazo": "2029-12-31"
  }'
```

### Deletar Meta

```bash
curl -X DELETE http://localhost:8080/api/metas/1 \
  -H "Content-Type: application/json"
```

**Response:** `204 No Content`

---

## 🔍 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Requisição bem-sucedida, sem conteúdo |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

## 🛡️ Validações

### Ativos Simples
- `nome`: Obrigatório, máximo 30 caracteres
- `tipo`: Obrigatório, valores válidos listados acima
- `valorAtual`: Obrigatório (exceto para tipo `investimentos`)

### Ativos Completos
- Todas as validações de Ativos Simples +
- `tipoFonteRenda`: Obrigatório para `conta_corrente` e `meu_negocio`
- `tipoInvestimento`: Obrigatório quando `tipo = investimentos`
- Validações específicas para cada tipo de investimento

### Metas
- `descricao`: Obrigatório
- `valorMeta`: Obrigatório, maior que zero
- `valorAtual`: Obrigatório, maior ou igual a zero
- `prazo`: Obrigatório, formato: YYYY-MM-DD

## 📝 Notas

1. Todos os valores monetários usam 2 casas decimais
2. Datas no formato ISO: `YYYY-MM-DD`
3. Timestamps no formato ISO: `YYYY-MM-DDTHH:mm:ss`
4. CORS habilitado para todas as origens (desenvolvimento)

---

## Contratos TypeScript

### Ativo Simples
```typescript
interface AtivoSimples {
  id: number;
  nome: string;
  tipo: 'conta_corrente' | 'meu_negocio' | 'investimentos' | 'contas_a_receber' | 
        'reserva_emergencia' | 'previdencia_privada' | 'outros';
  valorAtual: number;
  tipoFonteRenda?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

### Ativo Completo
```typescript
interface AtivoCompleto extends AtivoSimples {
  tipoInvestimento?: 'tesouro_direto' | 'renda_fixa' | 'renda_variavel';
  risco?: 'baixo' | 'medio' | 'alto';
  tesouroDireto?: TesouroDireto;
  rendaFixa?: RendaFixa;
  rendaVariavel?: RendaVariavel;
}

interface TesouroDireto {
  id: number;
  tipoTesouro: 'selic' | 'prefixado' | 'ipca';
  valorInvestido: number;
  valorAtual: number;
  dataCompra: string;
  dataVencimento: string;
  corretora: string;
  taxaRentabilidade: number;
  risco: 'baixo';
}

interface RendaFixa {
  id: number;
  tipoAtivoRendaFixa: 'cdb' | 'lc' | 'debenture' | 'lci' | 'lca' | 'cri' | 'cra' | 'outros';
  valorInvestido: number;
  valorAtual: number;
  corretora: string;
  dataCompra: string;
  dataVencimento: string;
  tipoTaxa: 'prefixado' | 'pos_fixado_cdi' | 'ipca';
  taxaContratada?: number;
  percentualCdi?: number;
  cdiAtual?: number;
  ipcaTaxa?: number;
  categoriaRiscoRendaFixa: 'baixo' | 'medio' | 'alto';
  isento: boolean;
  valorFinalEstimado?: number;
  irEstimado?: number;
  tipoDebenture?: 'incentivada' | 'comum';
}

interface RendaVariavel {
  id: number;
  tipoRendaVariavel: 'acoes' | 'fii' | 'etf';
  quantidade: number;
  precoMedio: number;
  valorAtual: number;
  corretora: string;
  categoriaRiscoRendaVariavel: 'baixo' | 'medio' | 'alto';
  dataCompra?: string;
  dividendosRecebidos?: number;
  dividendYield?: number;
  irEstimadoAcoes?: number;
  irEstimadoFii?: string;
  irEstimadoEtf?: number;
}
```

### Meta
```typescript
interface Meta {
  id: number;
  descricao: string;
  valorMeta: number;
  valorAtual: number;
  prazo: string;
  percentualProgresso: number;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

Voltar para: [README](../README.md)
