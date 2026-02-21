# 💰 Yuni - Gestão Financeira Pessoal

Aplicação web para gestão de patrimônio, investimentos e metas financeiras pessoais.

## 📋 Sobre o Projeto

**Yuni** é uma plataforma de controle financeiro que permite:
- ✅ Gerenciar ativos (conta corrente, investimentos, reserva de emergência)
- ✅ Cadastrar investimentos detalhados (Tesouro Direto, Renda Fixa, Renda Variável)
- ✅ Criar e monitorar metas financeiras com progresso automático
- ✅ Acompanhar evolução patrimonial

## 🚀 Tecnologias

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Navegação SPA
- **TailwindCSS** - Estilização
- **Chart.js** - Gráficos e visualizações
- **FontAwesome** - Ícones

### Backend
- **Node.js** - Runtime
- **TinyHTTP** - Framework HTTP minimalista
- **LowDB** - Banco de dados JSON
- **JSON Server** - Mock API

## 📁 Estrutura do Projeto

```
yuni-fed/
├── src/
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home/           # Dashboard principal
│   │   ├── Patrimonio/     # Gestão de ativos
│   │   ├── Financas/       # Análises financeiras
│   │   ├── Configuracoes/  # Configurações
│   │   └── Onboarding/     # Fluxo inicial
│   ├── shared/             # Componentes reutilizáveis
│   │   ├── Alert/          # Sistema de alertas
│   │   ├── Footer/         # Rodapé com navegação
│   │   ├── Menu/           # Menu lateral
│   │   ├── Modal/          # Componente modal
│   │   └── ...
│   ├── utils/              # Funções auxiliares
│   └── const/              # Constantes
├── docs/                   # Documentação completa
├── db.json                 # Banco de dados JSON
├── server.mjs              # Servidor API mock
└── vite.config.ts          # Configuração Vite
```

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js v18+ 
- npm v9+

### Comandos

```bash
# Instalar dependências
npm install

# Terminal 1: Iniciar API (porta 8080)
npm run server

# Terminal 2: Iniciar frontend (porta 5173)
npm run dev
```

Acesse: `http://localhost:5173`

## 📚 Documentação

A documentação completa está organizada em:

- [**CONCEITOS_REACT.md**](docs/CONCEITOS_REACT.md) - Hooks, Context, Router e patterns React
- [**API_ENDPOINTS.md**](docs/API_ENDPOINTS.md) - Endpoints, contratos e exemplos cURL
- [**DATABASE.md**](docs/DATABASE.md) - Estrutura de dados e operações
- [**UML_DIAGRAM.md**](docs/UML_DIAGRAM.md) - Diagramas de arquitetura e fluxo
- [**COMO_RODAR.md**](docs/COMO_RODAR.md) - Guia completo de execução e troubleshooting

## 🎯 Funcionalidades Principais

### 1. Dashboard (Home)
- Visão geral do patrimônio
- Metas financeiras com progresso
- Resumo de investimentos

### 2. Ativos
- **Ativos Simples**: Conta corrente, reserva de emergência, previdência
- **Investimentos Detalhados**:
  - **Tesouro Direto**: Selic, Prefixado, IPCA+
  - **Renda Fixa**: CDB, LC, LCI, LCA, Debêntures, CRI, CRA
  - **Renda Variável**: Ações, FIIs, ETFs
- Cálculo automático de risco
- Informações de rentabilidade e IR

### 3. Metas
- Criar metas financeiras com prazo
- Cálculo automático de progresso percentual
- Atualização de valores em tempo real

## 🌐 API Endpoints

```bash
GET    /metas        # Listar metas
POST   /metas        # Criar meta
# Ativos
GET    /api/ativos          # Listar todos
GET    /api/ativos/:id      # Obter por ID
POST   /api/ativos          # Criar simples
POST   /api/ativos/lote     # Criar múltiplos
POST   /api/ativos/completo # Criar com investimentos
PUT    /api/ativos/:id      # Atualizar
DELETE /api/ativos/:id      # Deletar

# Metas
GET    /api/metas           # Listar todas
GET    /api/metas/:id       # Obter por ID
POST   /api/metas           # Criar
PUT    /8080 em uso | `npx kill-port 8080
DELETE /api/metas/:id       # Deletar
Veja exemplos detalhados em [API_ENDPOINTS.md](docs/API_ENDPOINTS.md).

## 🛠️ Possíveis Erros

| Erro | Solução |
|------|---------|
| Porta 3001 em uso | `npx kill-port 3001` |
| nvm: prefix incompatible | `nvm use --delete-prefix v23.6.1` |
| Module not found | `rm -rf node_modules && npm install` |

Veja guia completo em [COMO_RODAR.md](docs/COMO_RODAR.md).

## 📦 Scripts NPM

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia dev server (Vite) |
| `npm run server` | Inicia API mock (port 3001) |
| `npm run build` | Build para produção |
| `npm run preview` | Preview da build |
| `npm run lint` | Verificar código (ESLint) |

## 🎨 Design System

- **Framework**: TailwindCSS 4.x
- **Ícones**: FontAwesome
- **Gráficos**: Chart.js + React Chart.js 2
- **Tipografia**: System fonts
- **Cores**: Tema customizado (ver [App.css](src/App.css))

## 🔐 Conceitos React Utilizados

- ✅ **Hooks**: useState, useEffect, useContext, useLocation, useNavigate
- ✅ **Context API**: AlertContext para estado global
- ✅ **React Router**: Navegação SPA
- ✅ **Controlled Components**: Formulários controlados
- ✅ **Conditional Rendering**: Renderização condicional
- ✅ **Component Composition**: Composição de componentes

Detalhes em [CONCEITOS_REACT.md](docs/CONCEITOS_REACT.md).

## 🏗️ Arquitetura

```
┌─────────── Frontend (React) ───────────┐
│  Components → Router → Context → Utils │
└────────────────┬────────────────────────┘
                 │ HTTP (fetch)
┌────────────────▼────────────────────────┐
│       Backend (TinyHTTP + LowDB)        │
│         Routes → Database (JSON)        │
└─────────────────────────────────────────┘
```
Veja diagramas em [UML_DIAGRAM.md](docs/UML_DIAGRAM.md).

## 🎯 Eu faria assim:

PostgreSQL local com Docker 
Subir banco no Supabase (free)
Deploy da API no Render
Conectar tudo
Colocar no seu portfólio 😏🔥

## 📄 Licença

Este projeto é privado e de uso pessoal.

## 👥 Autor

Desenvolvido para gestão financeira pessoal.

---

**Documentação atualizada em:** 20 de fevereiro de 2026
