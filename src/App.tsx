import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import './App.css'

import Home from './pages/Home/home'
import Onboarding from './pages/Onboarding/onboarding';
import Investimentos from './pages/Investimentos/investimentos'
import Financas from './pages/Financas/financas';
import Configuracoes from './pages/Configuracoes/configuracoes';
import Novo from './pages/Novo/novo';
import Footer from './shared/Footer/footer';
import Alert from './shared/Alert/Alert';
import { AlertProvider, useAlert } from './shared/Alert/AlertContext';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { alert, hideAlert } = useAlert();
  // const [corretoras, setCorretoras] = useState([]);
  // const [perfil, setPerfil] = useState([]);

  return (
    <>
    {alert.isVisible && (
      <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
        <Alert variant={alert.variant} onClose={hideAlert}>{alert.message}</Alert>
      </div>
    )}
    
    {['/', '/home'].includes(location.pathname) === false && (
      <header className="mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
          aria-label="Voltar"
        >
          <FontAwesomeIcon icon={faArrowLeft} size='2xl' className='absolute top-4 left-4 cursor-pointer text-gray-300' />
        </button>

        
      </header>
      )}
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/investimentos"
          element={
            <Investimentos
              // corretoras={corretoras}
              // perfil={perfil}
            />
          }
        />
        <Route path="/novo" element={<Novo />} />
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
