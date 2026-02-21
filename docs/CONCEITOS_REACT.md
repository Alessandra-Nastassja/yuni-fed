# Conceitos de React Utilizados

## 1. Hooks

### useState
Gerenciamento de estado local nos componentes:
```tsx
const [alert, setAlert] = useState({ isVisible: false, message: '', variant: 'success' });
```

### useContext
Compartilhamento de estado global (AlertContext) entre componentes sem prop drilling:
```tsx
const { alert, showAlert, hideAlert } = useAlert();
```

### useEffect
Execução de efeitos colaterais (fetching de dados, subscriptions):
```tsx
useEffect(() => {
  fetchMetas();
}, []);
```

### useLocation
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
