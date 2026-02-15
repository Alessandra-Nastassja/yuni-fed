import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home/home'
import Investimentos from './pages/Investimentos/investimentos'

const API_URL = "http://localhost:3001";

export const getAtivos = () => fetch(`${API_URL}/ativos`).then(r => r.json());
export const getNaoAtivos = () => fetch(`${API_URL}/naoAtivos`).then(r => r.json());
export const getCorretoras = () => fetch(`${API_URL}/corretoras`).then(r => r.json());
export const getMetas = () => fetch(`${API_URL}/metas`).then(r => r.json());
export const getPerfil = () => fetch(`${API_URL}/perfil`).then(r => r.json());
export const getPatrimonio = () => fetch(`${API_URL}/patrimonio`).then(r => r.json());

function App() {
  const [ativos, setAtivos] = useState([]);
  const [naoAtivos, setNaoAtivos] = useState([]);
  const [corretoras, setCorretoras] = useState([]);
  const [perfil, setPerfil] = useState([]);
  const [patrimonio, setPatrimonio] = useState([]);
  const [metas, setMetas] = useState([]);

  const fetchData = async () => {
    try {
      const [ativosData, naoAtivosData, corretorasData, metasData, patrimonioData, perfilData] = await Promise.all([
        getAtivos(),
        getNaoAtivos(),
        getCorretoras(),
        getMetas(),
        getPatrimonio(),
        getPerfil(),
      ]);

      setAtivos(ativosData);
      setNaoAtivos(naoAtivosData);
      setCorretoras(corretorasData);
      setPatrimonio(patrimonioData);
      setPerfil(perfilData);
      setMetas(metasData);

    } catch (error) {
      console.error(error);
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
            corretoras={corretoras}
            perfil={perfil}
            patrimonio={patrimonio}
            metas={metas}
          />
        } 
      />
    </Routes>
  )
}

export default App;
