import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home/home'
import Investimentos from './pages/Investimentos/investimentos'
import Financas from './pages/Financas/financas';

const API_URL = "http://localhost:8080";

export const getMetas = () => fetch(`${API_URL}/metas`).then(r => r.json());
// export const getCorretoras = () => fetch(`${API_URL}/corretoras`).then(r => r.json());
// export const getPerfil = () => fetch(`${API_URL}/perfil`).then(r => r.json());

function App() {
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
    <Routes>
      <Route path="/" element={<Home />} />
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
    </Routes>
  )
}

export default App;
