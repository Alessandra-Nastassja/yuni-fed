import { useEffect, useState } from "react";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAlert } from "@shared/Alert/AlertContext";
import Loading from "@shared/Loading/Loading";
import Badge from "@shared/Badge/Badge";
import { formatValue } from "@utils/currency";
import { formatTipoAtivo } from "@utils/formatAtivoTipo";

const API_URL = import.meta.env.VITE_API_URL;
const getAtivos = () => fetch(`${API_URL}/ativos`).then(r => r.json());

interface Ativo {
  id: number;
  nome: string;
  tipo: string;
  categoriaRisco: string | null;
  valorAtual: number;
}

export default function AtivosList({ title, className, iconColor = "bg-green-500" }: { title: string; className?: string; iconColor?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const { showAlert } = useAlert();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const ativo = await getAtivos();
      const { ativos } = ativo ?? {};
      setAtivos(ativos ?? []);
    } catch (error) {
      showAlert('Erro ao buscar ativos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ativosVazios = !ativos || ativos.length === 0;
  const totalAtivos = ativos.reduce((acc, ativo) => acc + ativo.valorAtual, 0);

  // Agrupar ativos por tipo e somar valores
  const ativosAgrupados = ativos.reduce((acc, ativo) => {
    const tipoExistente = acc.find(item => item.tipo === ativo.tipo);
    
    if (tipoExistente) {
      // Se já existe um ativo desse tipo, soma o valor
      tipoExistente.valorAtual += ativo.valorAtual;
    } else {
      // Se não existe, adiciona novo item agrupado
      acc.push({
        id: ativo.id,
        nome: formatTipoAtivo(ativo.tipo),
        tipo: ativo.tipo,
        categoriaRisco: ativo.categoriaRisco,
        valorAtual: ativo.valorAtual
      });
    }
    
    return acc;
  }, [] as Ativo[]);

  const ativosParaExibir = ativosAgrupados;

  return (
    <>
      <Loading isLoading={isLoading} message="Carregando ativos..." />

      <section className={`flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg ${className}`}>
        <p className="text-lg">{title}</p>

        {ativosVazios ? (
          <div className="flex items-center justify-center text-gray-500">
            <p className="text-sm flex gap-1 text-gray-500">Nenhum ativo foi cadastrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {ativosParaExibir.map((ativo) => (
              <article key={ativo.id} className="flex justify-between gap-2">
                <div className="flex gap-3 flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 ${iconColor} rounded-full`}>
                    <FontAwesomeIcon size='sm' icon={faDollarSign} className="text-white" />
                  </div>
                  <div className='flex flex-col'>
                    <p className="text-base">{ativo.nome}</p>
                    <Badge tipo={ativo.tipo} formatLabel={formatTipoAtivo} />
                  </div>
                </div>
                <p className="text-base">{formatValue(ativo.valorAtual)}</p>
              </article>
            ))}
          </div>
        )}

        <footer className="flex flex-row justify-between mt-2 bg-gray-100 p-4 rounded-lg items-center">
          <div className="flex items-center gap-2">
            <p className="font-medium">Total</p>
          </div>
          <small className="text-gray-600 font-medium">{formatValue(totalAtivos)}</small>
        </footer>
      </section>
    </>
  )
}