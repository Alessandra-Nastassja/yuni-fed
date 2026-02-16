import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home/home'
import Investimentos from './pages/Investimentos/investimentos'
import Financas from './pages/Financas/financas';

const API_URL = "http://localhost:8080";

export const getPatrimonio = () => fetch(`${API_URL}/patrimonio`).then(r => r.json());
// export const getCorretoras = () => fetch(`${API_URL}/corretoras`).then(r => r.json());
// export const getMetas = () => fetch(`${API_URL}/metas`).then(r => r.json());
// export const getPerfil = () => fetch(`${API_URL}/perfil`).then(r => r.json());

function App() {
  const [ativos, setAtivos] = useState([]);
  const [naoAtivos, setNaoAtivos] = useState([]);
  const [evolucao, setEvolucao] = useState([]);
  // const [corretoras, setCorretoras] = useState([]);
  // const [perfil, setPerfil] = useState([]);
  // const [metas, setMetas] = useState([]);

  const fetchData = async () => {
    try {
      const [
        // corretoras,
        // metas,
        // perfil,
        patrimonio,
      ] = await Promise.all([
        // getCorretoras(),
        // getMetas(),
        // getPerfil(),
        getPatrimonio(),
      ]);

      const {
        ativos = [],
        naoAtivos = [],
        evolucao = [],
      } = patrimonio ?? {};

      setAtivos(ativos);
      setNaoAtivos(naoAtivos);
      setEvolucao(evolucao);
      // setCorretoras(corretoras);
      // setPerfil(perfil);
      // setMetas(metas);

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
            ativos={ativos}
            naoAtivos={naoAtivos}
            evolucao={evolucao}
            // corretoras={corretoras}
            // perfil={perfil}
            // metas={metas}
          />
        }
      />
      <Route path='/financas' element={<Financas />} />
    </Routes>
  )
}

export default App;
