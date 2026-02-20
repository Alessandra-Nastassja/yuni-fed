# Como Rodar o Projeto

## Pré-requisitos

- **Node.js**: v18+ ou v20+ (recomendado: v23.6.1)
- **npm**: v9+ ou v10+
- **Git**: Para clonar o repositório

## Instalação

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd yuni-fed
```

### 2. Instalar Dependências
```bash
npm install
```

## Executar o Projeto

### Modo Desenvolvimento (2 terminais necessários)

**Terminal 1 - Backend (API Mock):**
```bash
npm run server
```
O servidor será iniciado em: `http://localhost:8080`

**Terminal 2 - Frontend (React + Vite):**
```bash
npm run dev
```
A aplicação será aberta em: `http://localhost:5173`

### Modo Produção

**1. Build:**
```bash
npm run build
```

**2. Preview:**
```bash
npm run preview
```

## Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| dev | `npm run dev` | Inicia servidor de desenvolvimento Vite |
| build | `npm run build` | Compila TypeScript e builda para produção |
| lint | `npm run lint` | Executa ESLint para verificar código |
| preview | `npm run preview` | Preview da build de produção |
| server | `npm run server` | Inicia servidor mock (port 3001) |

## Possíveis Erros e Soluções

### 1. Erro: `nvm: .npmrc has globalconfig/prefix`

**Sintoma:**
```
Your user's .npmrc file has a `globalconfig` and/or a `prefix` setting,
which are incompatible with nvm.
```

**Solução:**
```bash
nvm use --delete-prefix v23.6.1 --silent
```

Ou edite `~/.npmrc` e remova as linhas:
```
globalconfig=...
prefix=...
```

---

### 2. Erro: `EADDRINUSE: address already in use :::8080`

**Sintoma:**
```
Error: listen EADDRINUSE: address already in use :::8080
```

**Solução:**

**Option A - Matar processo:**
```bash
# macOS/Linux
lsof -ti:8080 | xargs kill -9

# Ou
npx kill-port 8080
```

**Option B - Mudar porta:**

Edite `server.mjs`:
```javascript
const PORT = 8081; // ou outra porta
```

---

### 3. Erro: `Module not found: Can't resolve 'react-router-dom'`

**Sintoma:**
```
Module not found: Error: Can't resolve 'react-router-dom'
```

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### 4. Erro: `Failed to fetch dynamically imported module`

**Sintoma:**
Erro no navegador ao navegar entre páginas.

**Solução:**
```bash
# Limpar cache do Vite
rm -rf node_modules/.vite
npm run dev
```

---

### 5. Erro: `Cannot find module './db.json'`

**Sintoma:**
```
Error: Cannot find module './db.json'
```

**Solução:**

Certifique-se que `db.json` existe na raiz:
```bash
# Se não existir, crie:
cat > db.json << 'EOF'
{
  "corretoras": [],
  "perfil": [],
  "metas": { "metas": [] },
  "patrimonio": []
}
EOF
```

---

### 6. Erro: `TypeScript: Cannot find type definition file for...`

**Sintoma:**
```
Cannot find type definition file for 'node'
```

**Solução:**
```bash
npm install --save-dev @types/node
```

---

### 7. Erro: `CORS Error` no navegador

**Sintoma:**
```
Access to fetch at 'http://localhost:8080/api/metas' from origin 
'http://localhost:5173' has been blocked by CORS
```

**Solução:**

No `server.mjs`, certifique-se que CORS está habilitado:
```javascript
import { cors } from '@tinyhttp/cors';
app.use(cors());
```

Se necessário, configure CORS específico:
```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

---

### 8. Erro: `Port 5173 is already in use`

**Sintoma:**
```
Port 5173 is in use, trying another one...
```

**Solução:**

**Option A - Matar processo:**
```bash
lsof -ti:5173 | xargs kill -9
```

**Option B - Configurar porta:**

Crie `vite.config.ts` com:
```typescript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

---

### 9. Erro: `ESLint: Parsing error`

**Sintoma:**
Erros de parsing no ESLint.

**Solução:**
```bash
npm run lint -- --fix
```

---

### 10. Banco de dados não persiste

**Sintoma:**
Dados são perdidos ao reiniciar o servidor.

**Verificação:**
```bash
# Verifique se db.json está sendo atualizado
cat db.json
```

**Solução:**

Certifique-se que há `await db.write()` após modificações:
```javascript
db.data.metas.metas.push(payload);
await db.write(); // ✅ Importante!
```

---

## Troubleshooting Geral

### Limpar Cache Completo
```bash
# Parar todos os processos
pkill -f "node.*vite"
pkill -f "node.*server"

# Limpar caches
rm -rf node_modules
rm -rf .vite
rm -rf dist
rm package-lock.json

# Reinstalar
npm install
```

### Verificar Versões
```bash
node --version   # >=18
npm --version    # >=9
```

### Logs Detalhados
```bash
# Vite com logs detalhados
npm run dev -- --debug

# Node com logs
DEBUG=* npm run server
```

## Estrutura de Portas

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (API) | 8080 | http://localhost:8080 |

## Dicas

- ✅ Sempre rode backend **antes** do frontend
- ✅ Use dois terminais separados
- ✅ Mantenha `db.json` versionado no Git
- ✅ Faça backup de `db.json` antes de testar
- ⚠️ Em caso de dúvida, limpe node_modules e reinstale
