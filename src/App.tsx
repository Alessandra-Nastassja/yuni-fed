import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import './App.css'

import Home from './pages/Home/home'
import Patrimonio from './pages/Patrimonio/patrimonio'
import Financas from './pages/Financas/financas';
import Configuracoes from './pages/Configuracoes/configuracoes';
import AtivosCreate from './pages/Patrimonio/components/Ativos/ativosCreate';
import NaoAtivosCreate from './pages/Patrimonio/components/NaoAtivos/naoAtivosCreate';
import Login from './pages/Onboarding/components/Login/login';

import Footer from './shared/Footer/footer';
import Alert from './shared/Alert/Alert';
import Menu from './shared/Menu/menu';
import { AlertProvider, useAlert } from './shared/Alert/AlertContext';
import Sign from './pages/Onboarding/components/Sign/sign';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = Boolean(localStorage.getItem('yuni_user'));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const { alert, hideAlert } = useAlert();
  const isAuthenticated = Boolean(localStorage.getItem('yuni_user'));
  const publicRoutes = ['/login', '/cadastrar'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

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

      {isPublicRoute === false && isAuthenticated && <Menu />}
      
      <div className={isPublicRoute ? '' : 'pb-24'}>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route
            path="/patrimonio"
            element={<ProtectedRoute><Patrimonio /></ProtectedRoute>}
          />
          <Route path="/novo-ativo" element={<ProtectedRoute><AtivosCreate /></ProtectedRoute>} />
          <Route path="/novo-nao-ativo" element={<ProtectedRoute><NaoAtivosCreate /></ProtectedRoute>} />
          <Route path='/financas' element={<ProtectedRoute><Financas /></ProtectedRoute>} />
          <Route path='/configuracoes' element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/cadastrar' element={<Sign />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
        </Routes>
      </div>
      
      {isPublicRoute === false && isAuthenticated && <Footer />}
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
