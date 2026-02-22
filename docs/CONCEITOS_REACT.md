# Conceitos de React Utilizados

## 1. Hooks

### useState ✅
Gerenciamento de estado local nos componentes:
```tsx
const [alert, setAlert] = useState({ isVisible: false, message: '', variant: 'success' });
```

### useContext ❌
Compartilhamento de estado global (AlertContext) entre componentes sem prop drilling:
```tsx
const { alert, showAlert, hideAlert } = useAlert();
```

### useEffect ✅
Execução de efeitos colaterais (fetching de dados, subscriptions):
```tsx
useEffect(() => {
  fetchMetas();
}, []);
```

### useCallback ⚠️
Memoização de funções para evitar re-renders desnecessários:
```tsx
const calcularValores = useCallback((values) => {
  // lógica de cálculo
}, [dependencies]);
```

### Custom Hooks

#### useMoneyMask
Aplica mascara monetária automática em campos:
```tsx
export const useMoneyMask = (inputIds: string[]) => {};

useMoneyMask(["valorInvestido", "precoCompra"]);
// Formata valores automaticamente para moeda
```

#### useInputValueListener
Dispara callback quando campos específicos mudam:
```tsx
useInputValueListener({
  inputIds: ["dataCompra", "dataVencimento", "percentualCdi"],
  onValuesChange: calcularValores,
});
// Recalcula valores quando qualquer um desses campos mudar
```

#### useMultiInputCalculation
Coordena múltiplos estados de cálculo:
```tsx
// Usado para coordenar cálculos complexos entre campos dependentes
```

### useLocation (window.location) ✅
Hook do React Router para acessar a localização atual da rota:
```tsx
const location = useLocation();
// Usado para exibir/ocultar Menu e Footer condicionalmente
```

## 2. Context API

### AlertContext
Context personalizado para gerenciar alertas globais da aplicação:
- `showAlert(message, variant)`: Exibe alerta
- `hideAlert()`: Oculta alerta
- Auto-hide após 3 segundos

**Uso:**
```tsx
<AlertProvider>
  <App />
</AlertProvider>
```

## 3. React Router DOM

### Navegação Declarativa
```tsx
<Routes>
  <Route path="/" element={<Onboarding />} />
  <Route path="/home" element={<Home />} />
  <Route path="/patrimonio" element={<Patrimonio />} />
  <Route path="/novo-ativo" element={<AtivosCreate />} />
  <Route path="/financas" element={<Financas />} />
  <Route path="/configuracoes" element={<Configuracoes />} />
</Routes>
```

### useNavigate
Navegação programática:
```tsx
const navigate = useNavigate();
navigate('/home');
```

## 4. Componentes Funcionais

Todos os componentes são funcionais (sem classes):
```tsx
function AppContent() {
  // lógica do componente
  return <div>...</div>
}
```

## 5. Props e Composição

Componentes reutilizáveis recebem props:
```tsx
<Alert variant={alert.variant} onClose={hideAlert}>
  {alert.message}
</Alert>
```

## 6. Conditional Rendering

Renderização condicional baseada em estado ou localização:
```tsx
{alert.isVisible && <Alert />}
{location.pathname !== '/' && <Menu />}
```

## 7. Forms e Controlled Components

Inputs controlados pelo estado do React:
```tsx
<input 
  value={formData.nome}
  onChange={(e) => setFormData({...formData, nome: e.target.value})}
/>
```

## 8. TypeScript

Tipagem estática para maior segurança:
```tsx
interface Meta {
  nome: string;
  valorMeta: number;
  prazo: number;
  valorAtual?: number;
}
```

## 9. SPA (Single Page Application)

Aplicação de página única com carregamento dinâmico de rotas sem recarregar a página.

## 10. Component Lifecycle

Gerenciado através de hooks:
- **Montagem**: `useEffect(() => {}, [])`
- **Atualização**: `useEffect(() => {}, [dependency])`
- **Desmontagem**: `useEffect(() => { return () => cleanup() }, [])`

## 11. Componentes Compartilhados (Shared)

### ReadOnlyField
Campo de leitura apenas com ícone:
```tsx
<ReadOnlyField
  icon={faPercent}
  label="CDI atual"
  value="10.65% a.a"
  isSkeleton={false}
/>
```

### InputField
Campo de input com ícone e validações:
```tsx
<InputField
  id="nome"
  name="nome"
  label="Nome"
  icon={faTag}
  type="text"
  placeholder="Digite..."
  value={value}
  onChange={handleChange}
/>
```

### SelectField
Dropdown com seleção de opções:
```tsx
<SelectField
  id="banco"
  name="banco"
  label="Banco"
  icon={faBuildingColumns}
  options={BANCOS_OPTIONS}
  onChange={handleChange}
  value={selectedBank}
/>
```

### DropdownSearch
Busca com dropdown inteligente:
```tsx
<DropdownSearch
  options={ativos}
  onSelect={handleSelect}
  placeholder="Buscar ativo..."
/>
```

## 12. Componentes de Formulários (Form Components)

### RendaVariavelForm
Formulário para investimentos em ações, FIIs, ETFs:
- Campos: tipo, quantidade, valor, corretora
- Funcionalidade: +/− buttons para quantidade, money mask

### RendaFixaForm
Formulário para renda fixa com cálculo de taxa:
- Tipos: Prefixado, Pos Fixado CDI, IPCA+
- Cálculos: valor atual, IR, valor líquido

### TesouroDiretoForm
Formulário para Tesouro Direto:
- Tipos: Selic, Prefixado, IPCA+
- Dados: data compra, vencimento, taxa

### ContasAReceberForm
Seleção de contas a receber com categoria:
- Dropdown dinâmico de ativos por categoria
- Validação de relacionamento

### ReservaDeEmergenciaForm
Formulário para reserva de emergência:
- Campos: nome, banco, valor investido, % CDI
- Cálculos automáticos: valor atual, IR, valor líquido
- Lógica reutilizada de renda fixa

