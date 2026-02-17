import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

import Home from './pages/Home/home'
import Onboarding from './pages/Onboarding/onboarding';
import Investimentos from './pages/Investimentos/investimentos'
import Financas from './pages/Financas/financas';
import Configuracoes from './pages/Configuracoes/configuracoes';
import Footer from './shared/Footer/footer';

const API_URL = "http://localhost:8080";

export const getMetas = () => fetch(`${API_URL}/metas`).then(r => r.json());
// export const getCorretoras = () => fetch(`${API_URL}/corretoras`).then(r => r.json());
// export const getPerfil = () => fetch(`${API_URL}/perfil`).then(r => r.json());

function App() {
  const location = useLocation();
  const [meta, setMeta] = useState([]);
  // const [corretoras, setCorretoras] = useState([]);
  // const [perfil, setPerfil] = useState([]);

  const fetchData = async () => {
    try {
      const [
        // corretoras,
        // perfil,
        meta,
      ] = await Promise.all([
        // getCorretoras(),
        // getPerfil(),
        getMetas(),
      ]);

      const { metas } = meta ?? {};

      // setCorretoras(corretoras);
      // setPerfil(perfil);
      setMeta(metas);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/investimentos"
          element={
            <Investimentos
              metas={meta}
              // corretoras={corretoras}
              // perfil={perfil}
            />
          }
        />
        <Route path='/financas' element={<Financas />} />
        <Route path='/configuracoes' element={<Configuracoes />} />
      </Routes>
      
      {location.pathname !== '/' && <Footer />}
    </>
  )
}

export default App;
