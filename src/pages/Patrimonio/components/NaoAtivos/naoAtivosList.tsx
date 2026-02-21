import { useEffect, useState } from "react";
import { 
  faDollarSign,
  faCar,
  faHome,
  faLandmark,
  faGem,
  faEllipsisH
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAlert } from "@shared/Alert/AlertContext";
import Loading from "@shared/Loading/Loading";
import Badge from "@shared/Badge/Badge";
import { formatValue } from "@utils/currency";
import { NAO_ATIVOS_TIPO_OPTIONS } from "@const/ativos";

const API_URL = import.meta.env.VITE_API_URL;
const getNaoAtivos = () => fetch(`${API_URL}/nao-ativos`).then(r => r.json());

// Mapear tipo de não ativo para ícone correspondente
const getIconeParaTipo = (tipo: string) => {
  const iconeMap: Record<string, any> = {
    veiculos: faCar,
    imoveis: faHome,
    fgts: faLandmark,
    objeto_de_valor: faGem,
    outros: faEllipsisH,
  };
  return iconeMap[tipo] || faDollarSign;
};

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

export default function NaoAtivosList({ title, className, iconColor = "bg-yellow-500" }: { title: string; className?: string; iconColor?: string }) {
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

  // Agrupar não ativos por tipo e somar valores
  const naoAtivosAgrupados = naoAtivos.reduce((acc, naoAtivo) => {
    const tipoExistente = acc.find(item => item.tipo === naoAtivo.tipo);
    
    if (tipoExistente) {
      // Se já existe um não ativo desse tipo, soma o valor
      tipoExistente.valorAtual += naoAtivo.valorAtual;
    } else {
      // Se não existe, adiciona novo item agrupado
      acc.push({
        id: naoAtivo.id,
        nome: formatTipoNaoAtivo(naoAtivo.tipo),
        tipo: naoAtivo.tipo,
        valorAtual: naoAtivo.valorAtual
      });
    }
    
    return acc;
  }, [] as NaoAtivo[]);

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
            {naoAtivosAgrupados.map((naoAtivo) => (
              <article key={naoAtivo.id} className="flex justify-between gap-2">
                <div className="flex gap-3 flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 ${iconColor} rounded-full`}>
                    <FontAwesomeIcon size='sm' icon={getIconeParaTipo(naoAtivo.tipo)} className="text-white" />
                  </div>
                  <div className='flex flex-col'>
                    <p className="text-base">{naoAtivo.nome}</p>
                    <Badge 
                      tipo={naoAtivo.tipo} 
                      formatLabel={formatTipoNaoAtivo}
                      excludeTypes={['fgts']}
                    />
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