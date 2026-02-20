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
