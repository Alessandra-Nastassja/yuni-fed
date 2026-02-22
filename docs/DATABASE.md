# Database - LowDB + JSON

O projeto utiliza **LowDB** com armazenamento em JSON (`db.json`), não um banco SQL tradicional.

## Estrutura do Banco de Dados

O arquivo `db.json` contém as seguintes coleções:

```json
{
  "ativos": [...],
  "metas": [...]
}
```

## Operações Equivalentes a SQL

### SELECT (Leitura)

**"SQL":**
```sql
SELECT * FROM ativos;
SELECT * FROM metas;
```

**LowDB:**
```javascript
await db.read();
const ativos = db.data?.ativos ?? [];
const metas = db.data?.metas ?? [];
```

**cURL:**
```bash
curl http://localhost:8080/api/ativos
curl http://localhost:8080/api/metas
```

---

### INSERT (Criação)

**"SQL":**
```sql
INSERT INTO metas (descricao, valorMeta, valorAtual, prazo) 
VALUES ('Casa Própria', 500000.00, 0, '2028-12-31');

INSERT INTO ativos (nome, tipo, valorAtual) 
VALUES ('Conta Corrente', 'conta_corrente', 5000.00);
```

**LowDB:**
```javascript
await db.read();
const novoId = db.data.metas.length > 0 ? Math.max(...db.data.metas.map(m => m.id)) + 1 : 1;
const novaMeta = { id: novoId, ...payload };
db.data.metas.push(novaMeta);
await db.write();
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/metas \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Casa Própria",
    "valorMeta": 500000.00,
    "valorAtual": 0,
    "prazo": "2028-12-31"
  }'
```

---

### UPDATE (Atualização)

**"SQL":**
```sql
UPDATE metas 
SET valorAtual = 50000.00 
WHERE id = 1;
```

**LowDB (implementado):**
```javascript
await db.read();
const index = db.data.metas.findIndex(m => m.id === 1);
if (index !== -1) {
  db.data.metas[index] = { ...db.data.metas[index], valorAtual: 50000.00 };
  await db.write();
}
```

**cURL:**
```bash
curl -X PUT http://localhost:8080/api/metas/1 \
  -H "Content-Type: application/json" \
  -d '{"valorAtual": 50000.00}'
```

---

### DELETE (Deleção)

**"SQL":**
```sql
DELETE FROM metas WHERE id = 1;
DELETE FROM ativos WHERE id = 2;
```

**LowDB (implementado):**
```javascript
await db.read();
const index = db.data.metas.findIndex(m => m.id === 1);
if (index !== -1) {
  db.data.metas.splice(index, 1);
  await db.write();
}
```

**cURL:**
```bash
curl -X DELETE http://localhost:8080/api/metas/1
curl -X DELETE http://localhost:8080/api/ativos/2
```

---

## Inicialização do Banco

### Criar estrutura inicial:
```javascript
db.data ||= { ativos: [], metas: [] };
await db.write();
```

### Resetar banco (apagar tudo):
```bash
# Backup
cp db.json db.json.bak

# Limpar
echo '{"ativos": [], "metas": []}' > db.json
```

## Backup e Restore

### Backup:
```bash
cp db.json db.backup.$(date +%Y%m%d_%H%M%S).json
```

### Restore:
```bash
cp db.backup.20260220_143000.json db.json
```

## Considerações

- ✅ **Simples**: Não precisa de servidor SQL
- ✅ **Portável**: Arquivo JSON pode ser versionado no Git
- ✅ **Rápido**: Para desenvolvimento e protótipos
- ❌ **Limitações**: Não suporta concorrência, transações ou queries complexas
- ❌ **Produção**: Para produção, migrar para PostgreSQL, MySQL ou MongoDB

## Estrutura de Ativos Complexos

### Ativo com Renda Variável
```json
{
  "id": 1,
  "nome": "VALE3",
  "tipo": "investimentos",
  "tipoInvestimento": "renda_variavel",
  "valorAtual": 3200.00,
  "risco": "alto",
  "dataCriacao": "2026-02-20T10:00:00",
  "dataAtualizacao": "2026-02-20T10:00:00",
  "rendaVariavel": {
    "tipoRendaVariavel": "acoes",
    "quantidade": 50,
    "precoCompra": 60.00,
    "precoAtual": 64.00,
    "corretora": "XP Investimentos",
    "categoriaRiscoRendaVariavel": "alto",
    "dataCompra": "2025-01-15"
  }
}
```

### Ativo com Renda Fixa
```json
{
  "id": 2,
  "nome": "CDB 110% CDI",
  "tipo": "investimentos",
  "tipoInvestimento": "renda_fixa",
  "valorAtual": 10500.00,
  "risco": "médio",
  "taxaSection": {
    "tipoTaxa": "pos_fixado_cdi",
    "percentualCdi": "110",
    "cdiAtual": "10.65",
    "ipcaTaxa": null
  },
  "rendaFixa": {
    "banco": "Itaú",
    "valorInvestido": 10000.00,
    "dataCompra": "2025-06-15",
    "dataVencimento": "2027-06-15",
    "irEstimado": 245.00,
    "valorAtual": 10500.00,
    "valorLiquidoEstimado": 10255.00
  }
}
```

### Ativo Reserva de Emergência
```json
{
  "id": 3,
  "nome": "Reserva de Emergência",
  "tipo": "reserva_emergencia",
  "valorAtual": 15000.00,
  "risco": "baixo",
  "banco": "Nubank",
  "reservaDeEmergencia": {
    "valorInvestido": 15000.00,
    "percentualCdi": "100",
    "cdiAtual": "10.65",
    "dataCompra": "2024-01-01",
    "dataVencimento": "2027-01-01",
    "irEstimado": 380.50,
    "valorAtual": 15437.25,
    "valorLiquidoEstimado": 15056.75
  }
}
```

### Ativo Simples (Conta)
```json
{
  "id": 4,
  "nome": "Conta Corrente",
  "tipo": "conta_corrente",
  "valorAtual": 5000.00,
  "dataCriacao": "2026-02-20T10:00:00",
  "dataAtualizacao": "2026-02-20T10:00:00"
}
```
