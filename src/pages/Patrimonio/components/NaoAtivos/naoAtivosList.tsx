import { useEffect, useState } from "react";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAlert } from "@shared/Alert/AlertContext";
import Loading from "@shared/Loading/Loading";
import { formatValue } from "@utils/currency";
import { NAO_ATIVOS_TIPO_OPTIONS } from "@const/ativos";

const API_URL = import.meta.env.VITE_API_URL;
const getNaoAtivos = () => fetch(`${API_URL}/nao-ativos`).then(r => r.json());

interface NaoAtivo {
  id: number;
  nome?: string;
  tipo: string;
  valorAtual: number;
}

const formatTipoNaoAtivo = (tipo: string) => {
  const option = NAO_ATIVOS_TIPO_OPTIONS.find(opt => opt.value === tipo);
  return option?.label || tipo;
};

export default function NaoAtivosList({ title, className, iconColor = "bg-red-500" }: { title: string; className?: string; iconColor?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [naoAtivos, setNaoAtivos] = useState<NaoAtivo[]>([]);
  const { showAlert } = useAlert();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getNaoAtivos();
      const { naoAtivos } = data ?? {};
      setNaoAtivos(naoAtivos ?? []);
    } catch (error) {
      showAlert('Erro ao buscar não ativos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const naoAtivosVazios = !naoAtivos || naoAtivos.length === 0;
  const totalNaoAtivos = naoAtivos.reduce((acc, naoAtivo) => acc + naoAtivo.valorAtual, 0);

  return (
    <>
      <Loading isLoading={isLoading} message="Carregando não ativos..." />

      <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
        <p className="text-lg">{title}</p>

        {naoAtivosVazios ? (
          <div className="flex items-center justify-center text-gray-500">
            <p className="text-sm flex gap-1 text-gray-500">Nenhum não ativo foi cadastrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {naoAtivos.map((naoAtivo) => (
              <article key={naoAtivo.id} className="flex justify-between gap-2">
                <div className="flex gap-3 flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 ${iconColor} rounded-full`}>
                    <FontAwesomeIcon size='sm' icon={faDollarSign} className="text-white" />
                  </div>
                  <div className='flex flex-col'>
                    <p className="text-base">{naoAtivo.nome || formatTipoNaoAtivo(naoAtivo.tipo)}</p>
                    {
                      naoAtivo.tipo !== "fgts" && (
                        <small className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                          {formatTipoNaoAtivo(naoAtivo.tipo)}
                        </small>
                      )
                    }
                  </div>
                </div>
                <p className="text-base">{formatValue(naoAtivo.valorAtual)}</p>
              </article>
            ))}
          </div>
        )}

        <footer className="flex flex-row justify-between mt-2 bg-gray-100 p-4 rounded-lg items-center">
          <div className="flex items-center gap-2">
            <p className="font-medium">Total</p>
          </div>
          <small className="text-gray-600 font-medium">{formatValue(totalNaoAtivos)}</small>
        </footer>
      </section>
    </>
  )
}