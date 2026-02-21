# 🔄 Resumo de Mudanças - API YUNI

## Mudanças Principais

### ✅ Porta Alterada
- **Antes**: `http://localhost:3001`
- **Agora**: `http://localhost:8080`

### ✅ Estrutura de Dados
**Banco de Dados (`db.json`):**
- ❌ Removido: `corretoras`, `perfil`, `patrimonio`
- ✅ Adicionado: `ativos` (estrutura completa), `metas` (reformulado)

### ✅ Novos Endpoints

#### Ativos (Novo)
```
GET    /api/ativos          → Listar todos
GET    /api/ativos/:id      → Obter por ID
POST   /api/ativos          → Criar simples
POST   /api/ativos/lote     → Criar múltiplos
POST   /api/ativos/completo → Criar com investimentos detalhados
PUT    /api/ativos/:id      → Atualizar
DELETE /api/ativos/:id      → Deletar
```

#### Metas (Reformulado)
```
GET    /api/metas           → Listar todas
GET    /api/metas/:id       → Obter por ID
POST   /api/metas           → Criar
PUT    /api/metas/:id       → Atualizar
DELETE /api/metas/:id       → Deletar
```

### ✅ Endpoints Removidos
- ❌ `GET /corretoras`
- ❌ `GET /perfil`
- ❌ `GET /patrimonio`

---

## Novos Recursos

### 1. Gestão Completa de Ativos
- **Ativos Simples**: Conta corrente, reserva, previdência
- **Investimentos Detalhados**:
  - **Tesouro Direto**: Selic, Prefixado, IPCA+
  - **Renda Fixa**: CDB, LC, LCI, LCA, Debêntures, CRI, CRA
  - **Renda Variável**: Ações, FIIs, ETFs

### 2. Metas com Progresso Automático
- Campo `percentualProgresso` calculado automaticamente
- Estrutura simplificada: `descricao`, `valorMeta`, `valorAtual`, `prazo`

### 3. Operações CRUD Completas
- Todos os endpoints agora suportam: GET, POST, PUT, DELETE
- IDs autoincrementais
- Timestamps automáticos (`dataCriacao`, `dataAtualizacao`)

---

## Estruturas de Dados

### Ativo Simples
```json
{
  "id": 1,
  "nome": "Conta Corrente",
  "tipo": "conta_corrente",
  "valorAtual": 5000.00,
  "dataCriacao": "2026-02-20T10:00:00",
  "dataAtualizacao": "2026-02-20T10:00:00"
}
```

### Ativo com Investimento (Tesouro Direto)
```json
{
  "id": 3,
  "nome": "Tesouro Selic 2027",
  "tipo": "investimentos",
  "tipoInvestimento": "tesouro_direto",
  "valorAtual": 10500.00,
  "risco": "baixo",
  "tesouroDireto": {
    "id": 3,
    "tipoTesouro": "selic",
    "valorInvestido": 10000.00,
    "valorAtual": 10500.00,
    "dataCompra": "2025-01-15",
    "dataVencimento": "2027-12-31",
    "corretora": "XP Investimentos",
    "taxaRentabilidade": 5.5,
    "risco": "baixo"
  }
}
```

### Meta
```json
{
  "id": 1,
  "descricao": "Independência Financeira",
  "valorMeta": 1000000.00,
  "valorAtual": 79777.65,
  "prazo": "2030-12-31",
  "percentualProgresso": 8.0,
  "dataCriacao": "2024-01-01T00:00:00",
  "dataAtualizacao": "2026-02-20T10:00:00"
}
```

---

## Como Testar

### Iniciar Servidor
```bash
npm run server
# Server rodando em: http://localhost:8080
```

### Testar Endpoints

**Listar Ativos:**
```bash
curl http://localhost:8080/api/ativos
```

**Criar Meta:**
```bash
curl -X POST http://localhost:8080/api/metas \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Carro Novo",
    "valorMeta": 80000.00,
    "valorAtual": 20000.00,
    "prazo": "2027-12-31"
  }'
```

**Criar Investimento em Ações:**
```bash
curl -X POST http://localhost:8080/api/ativos/completo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "VALE3",
    "tipo": "investimentos",
    "tipoInvestimento": "renda_variavel",
    "rendaVariavel": {
      "tipoRendaVariavel": "acoes",
      "quantidade": 50,
      "precoMedio": 60.00,
      "valorAtual": 3200.00,
      "corretora": "XP",
      "categoriaRiscoRendaVariavel": "alto"
    }
  }'
```

---

## Migração do Frontend

### Atualizar URLs
**Antes:**
```typescript
fetch('http://localhost:3001/metas')
```

**Agora:**
```typescript
fetch('http://localhost:8080/api/metas')
fetch('http://localhost:8080/api/ativos')
```

### Atualizar Estrutura de Metas
**Antes:**
```typescript
interface Meta {
  nome: string;
  valorMeta: number;
  prazo: number;
  valorAtual?: number;
}
```

**Agora:**
```typescript
interface Meta {
  id: number;
  descricao: string;
  valorMeta: number;
  valorAtual: number;
  prazo: string; // ISO date: "2028-12-31"
  percentualProgresso: number;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

---

## Próximos Passos

1. ✅ Servidor atualizado
2. ✅ Banco de dados migrado
3. ✅ Documentação atualizada
4. ⏳ **Próximo**: Atualizar componentes frontend para usar nova API
5. ⏳ Testar integração completa

---

**Documentação completa**: [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md)
