import { Routes, Route, useLocation } from 'react-router-dom'

import './App.css'

import Home from './pages/Home/home'
import Onboarding from './pages/Onboarding/onboarding';
import Patrimonio from './pages/Patrimonio/patrimonio'
import Financas from './pages/Financas/financas';
import Configuracoes from './pages/Configuracoes/configuracoes';
import AtivosCreate from './pages/Patrimonio/components/Ativos/ativosCreate';

import Footer from './shared/Footer/footer';
import Alert from './shared/Alert/Alert';
import Menu from './shared/Menu/menu';
import { AlertProvider, useAlert } from './shared/Alert/AlertContext';
import NaoAtivosCreate from './pages/Patrimonio/components/NaoAtivos/naoAtivosCreate';

function AppContent() {
  const location = useLocation();
  const { alert, hideAlert } = useAlert();

  return (
    <>
    {alert.isVisible && (
      <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
        <Alert 
          variant={alert.variant} 
          onClose={hideAlert}>{alert.message}
        </Alert>
      </div>
    )}

      {location.pathname !== '/' && <Menu />}
      
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/patrimonio"
          element={<Patrimonio />}
        />
        <Route path="/novo-ativo" element={<AtivosCreate />} />
        <Route path="/novo-nao-ativo" element={<NaoAtivosCreate />} />
        <Route path='/financas' element={<Financas />} />
        <Route path='/configuracoes' element={<Configuracoes />} />
      </Routes>
      
      {location.pathname !== '/' && <Footer />}
    </>
  )
}

function App() {
  return (
    <AlertProvider>
      <AppContent />
    </AlertProvider>
  )
}

export default App;
