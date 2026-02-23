import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  faDollarSign,
  faList,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "@shared/SelectField/selectField";
import InputField from "@shared/InputField/inputField";
import { useAlert } from "@shared/Alert/AlertContext";
import Loading from "@shared/Loading/Loading";
import { RiskSelectField } from "@shared/RiskSelectField/RiskSelectField";
import { formatTipoAtivo } from "@utils/formatAtivoTipo";
import { applyMoneyMask, parseMoneyString } from "@utils/currency";

import {
  ATIVOS_CATEGORIA_INVESTIMENTO_OPTIONS,
  ATIVOS_FONTE_RENDA_OPTIONS,
  ATIVOS_TIPO_OPTIONS,
  BANCOS_OPTIONS,
  CONTAS_A_RECEBER_CATEGORIA_OPTIONS,
  RISCO_BAIXO,
  RISCO_BAIXO_MEDIO,
  RISCO_BAIXO_MEDIO_ALTO,
  RISCO_MEDIO_ALTO,
} from "@const/ativos";
import {
  calcularAliquotaIR,
  calcularValorAtualRendaFixa,
  calcularValorAtualRendaVariavel,
  calcularValorAtualTesouroDireto,
  calcularValorFinalEstimadoRendaFixa,
} from "@utils/investmentCalculations";

import { TesouroDiretoForm } from "./components/tesouroDiretoForm";
import { RendaFixaForm } from "./components/rendaFixaForm";
import { RendaVariavelForm } from "./components/rendaVariavelForm";
import { ContasAReceberForm } from "./components/contasAReceberForm";
import { ReservaDeEmergenciaForm } from "./components/reservaDeEmergenciaForm";

const API_URL = import.meta.env.VITE_API_URL;

export default function AtivosCreate() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [tipoAtivo, setTipoAtivo] = useState("");
  const [tipoInvestimento, setTipoInvestimento] = useState("");
  const [tipoAtivoRendaFixa, setTipoAtivoRendaFixa] = useState("");
  const [tipoRendaVariavel, setTipoRendaVariavel] = useState("");
  const [tipoFonteRenda, setTipoFonteRenda] = useState("");
  const [nomeBancoCustomizado, setNomeBancoCustomizado] = useState("");
  const [bancSelecionado, setBancoSelecionado] = useState("");
  const [categoriaContasAReceber, setCategoriaContasAReceber] = useState("");
  const [ativosExistentes, setAtivosExistentes] = useState<Array<{
    id: number; 
    nome: string; 
    tipo: string; 
    tipoInvestimento?: string;
    rendaVariavel?: {
      tipoRendaVariavel?: string;
    };
  }>>([]);
  const [ativoVinculado, setAtivoVinculado] = useState("");

  const getRiscoOptions = () => {
    if (tipoInvestimento === "tesouro_direto") {
      return RISCO_BAIXO;
    }
    if (tipoInvestimento === "renda_fixa") {
      if (["lci", "lca", "cri", "cra"].includes(tipoAtivoRendaFixa)) {
        return RISCO_BAIXO;
      }
      if (tipoAtivoRendaFixa === "cdb" || tipoAtivoRendaFixa === "lc") {
        return RISCO_BAIXO_MEDIO;
      }
      if (tipoAtivoRendaFixa === "debenture") {
        return RISCO_MEDIO_ALTO;
      }
    }
    if (tipoInvestimento === "renda_variavel") {
      if (tipoRendaVariavel === "acoes") {
        return RISCO_MEDIO_ALTO;
      }
      if (tipoRendaVariavel === "fii") {
        return RISCO_BAIXO_MEDIO;
      }
    }
    return RISCO_BAIXO_MEDIO_ALTO;
  };

  const riscoOptions = getRiscoOptions();

  // Obter opções de categorias (sempre todas as opções disponíveis)
  const categoriasDisponiveis = CONTAS_A_RECEBER_CATEGORIA_OPTIONS;

  // Buscar ativos existentes para vincular
  useEffect(() => {
    const fetchAtivos = async () => {
      try {
        // Buscar ativos completos para ter acesso ao tipoInvestimento
        const response = await fetch(`${API_URL}/ativos/completo`);
        if (response.ok) {
          const data = await response.json();
          // Garantir que data é um array ou tem a propriedade ativos
          let ativosArray = [];
          if (Array.isArray(data)) {
            ativosArray = data;
          } else if (data.ativos && Array.isArray(data.ativos)) {
            ativosArray = data.ativos;
          } else {
            console.warn("API retornou formato inesperado:", data);
          }
          setAtivosExistentes(ativosArray);
        }
      } catch (error) {
        console.error("Erro ao buscar ativos:", error);
        setAtivosExistentes([]);
      }
    };
    fetchAtivos();
  }, []);

  useEffect(() => {
    // Aplicar máscara de moeda nos campos de dinheiro
    const moneyInputs = ['valorAtual', 'valorInvestido', 'precoMedio', 'precoAtual', 'dividendosRecebidos', 'dividendYield'];
    moneyInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) applyMoneyMask(inputId);
    });
  }, []);

  // Aplicar máscara específica quando o tipo de ativo muda (para não-investimentos)
  useEffect(() => {
    if (tipoAtivo && tipoAtivo !== "investimentos") {
      setTimeout(() => {
        const valorAtualInput = document.getElementById("valorAtual");
        if (valorAtualInput) applyMoneyMask("valorAtual");
      }, 0);
    }
  }, [tipoAtivo]);

  // Limpar ativo vinculado quando categoria muda
  useEffect(() => {
    if (categoriaContasAReceber) {
      setAtivoVinculado("");
    }
  }, [categoriaContasAReceber]);

  // Obter lista de ativos filtrados
  const getAtivosFiltrados = () => {
    if (!Array.isArray(ativosExistentes)) return [];
    
    return ativosExistentes.filter((ativo) => {
      // Filtro base: apenas investimentos de renda variável
      if (ativo.tipo !== "investimentos" || ativo.tipoInvestimento !== "renda_variavel") {
        return false;
      }
      
      // Filtrar por nome se o usuário está digitando (3+ caracteres)
      if (ativoVinculado.length >= 3) {
        if (!ativo.nome.toLowerCase().includes(ativoVinculado.toLowerCase())) {
          return false;
        }
      }
      
      const tipoRV = ativo.rendaVariavel?.tipoRendaVariavel;
      
      // Dividendos e JCP → apenas ações
      if (categoriaContasAReceber === 'dividendos' || categoriaContasAReceber === 'jcp') {
        return tipoRV === 'acoes';
      }
      
      // Rendimento → apenas FII
      if (categoriaContasAReceber === 'rendimento') {
        return tipoRV === 'fii';
      }
      
      // Proventos → apenas ETF
      if (categoriaContasAReceber === 'proventos') {
        return tipoRV === 'etf';
      }
      
      // Outros ou sem categoria → todos os tipos
      return true;
    });
  };

  // ==================== Funções Auxiliares ====================

  const resolverNomeAtivo = (tipo: string, nomeRaw: string, formData?: FormData): string => {
    const resolvers: Record<string, () => string> = {
      conta_corrente: () => 
        nomeRaw === "outros" && nomeBancoCustomizado
          ? nomeBancoCustomizado
          : BANCOS_OPTIONS.find(opt => opt.value === nomeRaw)?.label || nomeRaw,
      
      contas_a_receber: () => 
        categoriaContasAReceber === "outros"
          ? nomeRaw
          : CONTAS_A_RECEBER_CATEGORIA_OPTIONS.find(opt => opt.value === categoriaContasAReceber)?.label || categoriaContasAReceber,
      
      reserva_emergencia: () => {
        if (!formData) return nomeRaw;
        const bancoRaw = (formData.get("banco") as string) || "";
        const bancoCustomizado = (formData.get("bancoCustomizado") as string) || "";
        return bancoRaw === "outros" && bancoCustomizado
          ? bancoCustomizado
          : BANCOS_OPTIONS.find(opt => opt.value === bancoRaw)?.label || bancoRaw;
      },
    };

    return resolvers[tipo]?.() || nomeRaw;
  };

  const validarCamposObrigatorios = (tipo: string, nome: string): string | null => {
    if (!tipo) {
      return "Por favor, preencha todos os campos obrigatórios.";
    }

    if (tipo === "contas_a_receber" && categoriaContasAReceber === "outros" && !nome) {
      return "Por favor, preencha o nome quando a categoria for 'outros'.";
    }

    // Nome não é obrigatório para contas_a_receber e reserva_emergencia (gerado automaticamente)
    if (tipo !== "contas_a_receber" && tipo !== "reserva_emergencia" && !nome) {
      return "Por favor, preencha todos os campos obrigatórios.";
    }

    return null;
  };

  const construirPayloadBase = (nome: string, tipo: string) => {
    const payload: any = { nome, tipo };

    if (tipoFonteRenda) {
      payload.tipoFonteRenda = tipoFonteRenda;
    }

    if (tipo === "contas_a_receber") {
      if (categoriaContasAReceber) {
        payload.categoriaContasAReceber = categoriaContasAReceber;
      }

      if (ativoVinculado && Array.isArray(ativosExistentes)) {
        const ativoEncontrado = ativosExistentes.find(a => a.nome === ativoVinculado);
        if (ativoEncontrado) {
          payload.ativoVinculadoId = ativoEncontrado.id;
        }
      }
    }

    return payload;
  };

  const construirPayloadReservaEmergencia = (formData: FormData) => {
    const bancoRaw = (formData.get("banco") as string) || "";
    const bancoCustomizado = (formData.get("bancoCustomizado") as string) || "";
    const banco = bancoRaw === "outros" && bancoCustomizado
      ? bancoCustomizado
      : BANCOS_OPTIONS.find(opt => opt.value === bancoRaw)?.label || bancoRaw;

    const valorInvestido = parseMoneyString((formData.get("valorInvestido") as string) || "0");
    const percentualCdiRaw = (formData.get("percentualCdi") as string) || "";
    const cdiAtualRaw = (formData.get("cdi") as string) || "";
    const dataCompra = formData.get("dataCompra") as string;
    const dataVencimento = formData.get("dataVencimento") as string;

    // Se não houver dados de cálculo (bancos sem CDI), retornar apenas o básico
    if (!percentualCdiRaw || !cdiAtualRaw || !dataCompra || !dataVencimento) {
      return {
        banco,
        valorInvestido,
        valorAtual: valorInvestido,
      };
    }

    // Cálculos para bancos com CDI (nubank, picpay, pag_seguro)
    const percentualCdi = parseFloat(percentualCdiRaw.replace(",", "."));
    const cdiAtual = parseFloat(cdiAtualRaw.replace(",", "."));

    const valorAtualCalculado = calcularValorAtualRendaFixa({
      valorInvestido: String(valorInvestido),
      tipoTaxa: "pos_fixado_cdi",
      percentualCdi: String(percentualCdi),
      cdiAtual: String(cdiAtual),
      dataCompra,
      dataVencimento,
    });

    const aliquotaIR = calcularAliquotaIR(dataCompra, dataVencimento);
    
    const valorLiquidoEstimado = calcularValorFinalEstimadoRendaFixa({
      valorAtual: valorAtualCalculado,
      valorInvestido,
      dataCompra,
      dataVencimento,
      isento: false, // Reserva de emergência não é isenta
    });

    return {
      banco,
      valorInvestido,
      valorAtual: valorAtualCalculado,
      percentualCdi,
      cdi: cdiAtual,
      dataCompra,
      dataVencimento,
      irEstimado: aliquotaIR,
      valorLiquidoEstimado,
    };
  };

  const construirPayloadTesouroDireto = (formData: FormData) => {
    const valorInvestido = parseFloat((formData.get("valorInvestido") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0");
    const taxaRentabilidade = parseFloat((formData.get("taxaRentabilidade") as string) || "0");
    const dataCompra = formData.get("dataCompra") as string;
    const dataVencimento = formData.get("dataVencimento") as string;
    
    const valorAtualCalculado = calcularValorAtualTesouroDireto({
      valorInvestido,
      taxaRentabilidade,
      dataCompra,
      dataVencimento,
    });

    return {
      tesouroDireto: {
        tipoTesouro: formData.get("tipoTesouro"),
        valorInvestido,
        valorAtual: valorAtualCalculado,
        dataCompra,
        dataVencimento,
        corretora: formData.get("corretora"),
        taxaRentabilidade,
      },
      valorAtual: valorAtualCalculado,
    };
  };

  const construirPayloadRendaFixa = (formData: FormData) => {
    const tipoAtivoRendaFixa = formData.get("tipoAtivoRendaFixa") as string;
    const tipoDebenture = formData.get("tipoDebenture") as string;
    const valorInvestido = parseMoneyString(formData.get("valorInvestido") as string);
    
    const valorAtualCalculado = calcularValorAtualRendaFixa({
      valorInvestido: String(valorInvestido),
      tipoTaxa: (formData.get("tipoTaxa") as string) || "",
      taxaContratada: formData.get("taxaContratada") as string,
      percentualCdi: formData.get("percentualCdi") as string,
      cdiAtual: formData.get("cdiAtual") as string,
      ipcaTaxa: formData.get("ipcaTaxa") as string,
      dataCompra: formData.get("dataCompra") as string,
      dataVencimento: formData.get("dataVencimento") as string,
    });

    const isIsentoIR = ["lci", "lca", "cri", "cra"].includes(tipoAtivoRendaFixa) ||
      (tipoAtivoRendaFixa === "debenture" && tipoDebenture === "incentivada");

    const valorFinalEstimado = calcularValorFinalEstimadoRendaFixa({
      valorAtual: valorAtualCalculado,
      valorInvestido,
      dataCompra: formData.get("dataCompra") as string,
      dataVencimento: formData.get("dataVencimento") as string,
      isento: isIsentoIR,
    });

    return {
      rendaFixa: {
        tipoAtivoRendaFixa,
        tipoDebenture: tipoDebenture || undefined,
        valorInvestido,
        valorAtual: valorAtualCalculado,
        corretora: formData.get("corretora"),
        dataCompra: formData.get("dataCompra"),
        dataVencimento: formData.get("dataVencimento"),
        tipoTaxa: formData.get("tipoTaxa"),
        taxaContratada: formData.get("taxaContratada") ? parseFloat(formData.get("taxaContratada") as string) : undefined,
        percentualCdi: formData.get("percentualCdi") ? parseFloat(formData.get("percentualCdi") as string) : undefined,
        cdiAtual: formData.get("cdiAtual") ? parseFloat((formData.get("cdiAtual") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0") : undefined,
        ipcaTaxa: formData.get("ipcaTaxa") ? parseFloat(formData.get("ipcaTaxa") as string) : undefined,
        categoriaRiscoRendaFixa: formData.get("categoriaRiscoRendaFixa"),
        irEstimado: formData.get("irEstimado") ? parseFloat(formData.get("irEstimado") as string) : undefined,
        valorFinalEstimado,
      },
      valorAtual: valorAtualCalculado,
    };
  };

  const construirPayloadRendaVariavel = (formData: FormData) => {
    const quantidade = parseFloat((formData.get("quantidade") as string) || "0");
    const precoMedio = parseMoneyString((formData.get("precoMedio") as string) || "0");
    const precoAtual = parseMoneyString((formData.get("precoAtual") as string) || "0");
    
    const valorInvestido = quantidade * precoMedio;
    const valorAtualCalculado = calcularValorAtualRendaVariavel({
      quantidade,
      precoAtualMercado: precoAtual,
    });

    const tipoRenda = formData.get("tipoRendaVariavel") as string;
    const rendaVariavelPayload: any = {
      tipoRendaVariavel: tipoRenda,
      quantidade,
      precoMedio,
      valorInvestido,
      valorAtual: valorAtualCalculado,
      corretora: formData.get("corretora"),
      categoriaRiscoRendaVariavel: formData.get("categoriaRiscoRendaVariavel"),
    };

    if (tipoRenda === "acoes") {
      rendaVariavelPayload.dataCompra = formData.get("dataCompra");
      rendaVariavelPayload.dividendosRecebidos = parseFloat((formData.get("dividendosRecebidos") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0");
      rendaVariavelPayload.irEstimadoAcoes = formData.get("irEstimado") ? parseInt(formData.get("irEstimado") as string) : undefined;
    }

    return {
      rendaVariavel: rendaVariavelPayload,
      valorAtual: valorAtualCalculado,
    };
  };

  const construirPayloadInvestimentos = (formData: FormData) => {
    const payloadBuilders: Record<string, (fd: FormData) => any> = {
      tesouro_direto: construirPayloadTesouroDireto,
      renda_fixa: construirPayloadRendaFixa,
      renda_variavel: construirPayloadRendaVariavel,
    };

    const builder = payloadBuilders[tipoInvestimento];
    return builder ? builder(formData) : {};
  };

  // ==================== Handler Principal ====================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const nomeRaw = formData.get("nome") as string;
    const tipo = formData.get("tipo") as string;
    const nome = resolverNomeAtivo(tipo, nomeRaw, formData);

    // Validação
    const erroValidacao = validarCamposObrigatorios(tipo, nome);
    if (erroValidacao) {
      showAlert(erroValidacao, "error");
      return;
    }

    try {
      setIsLoading(true);

      // Construir payload base
      const payload = construirPayloadBase(nome, tipo);

      // Adicionar dados específicos por tipo
      if (tipo === "reserva_emergencia") {
        Object.assign(payload, construirPayloadReservaEmergencia(formData));
      } else if (tipo === "investimentos") {
        payload.tipoInvestimento = tipoInvestimento;
        Object.assign(payload, construirPayloadInvestimentos(formData));
      } else {
        // Ativos simples
        const valorAtual = parseFloat((formData.get("valorAtual") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0");
        payload.valorAtual = valorAtual;
      }

      // Enviar para API
      const response = await fetch(
        `${API_URL}/ativos${tipo === "investimentos" ? "/completo" : ""}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar ativo");
      }

      const tipoFormatado = formatTipoAtivo(tipo);
      showAlert(`"${nomeRaw}" (${tipoFormatado}) criado com sucesso!`, "success");

      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate("/patrimonio");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Erro:", error);
      showAlert("Erro ao criar ativo. Tente novamente.", "error");
    }
  };

  return (
    <main className="m-4 p-4 pb-24">
      <Loading isLoading={isLoading} message="Criando ativo..." />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <SelectField
          id="tipo"
          name="tipo"
          label="Tipo"
          icon={faList}
          options={ATIVOS_TIPO_OPTIONS}
          onChange={(value) => setTipoAtivo(value)}
          defaultValue=""
        />

        {tipoAtivo === "investimentos" && (
          <SelectField
            id="tipoInvestimento"
            name="tipoInvestimento"
            label="Categoria de investimento"
            icon={faList}
            options={ATIVOS_CATEGORIA_INVESTIMENTO_OPTIONS}
            onChange={(value) => {
              setTipoInvestimento(value);
              setTipoAtivoRendaFixa("");
              setTipoRendaVariavel("");
            }}
            defaultValue=""
          />
        )}

        {tipoAtivo === "conta_corrente" ? (
          <>
            <SelectField
              id="nome"
              name="nome"
              label="Banco"
              icon={faTag}
              options={BANCOS_OPTIONS}
              onChange={(value) => {
                setBancoSelecionado(value);
                setNomeBancoCustomizado("");
              }}
              defaultValue=""
            />
            {bancSelecionado === "outros" && (
              <InputField
                id="nomeBancoCustomizado"
                name="nomeBancoCustomizado"
                label="Nome do banco"
                icon={faTag}
                placeholder="Digite o nome do banco"
                value={nomeBancoCustomizado}
                onChange={(e) => setNomeBancoCustomizado(e.target.value)}
                maxLength={50}
              />
            )}
          </>
        ) : tipoAtivo === "contas_a_receber" ? (
          <>
            {categoriaContasAReceber === "outros" && (
              <InputField
                id="nome"
                name="nome"
                label="Nome"
                icon={faTag}
                placeholder="Digite o nome"
                maxLength={30}
              />
            )}
          </>
        ) : tipoAtivo === "reserva_emergencia" ? (
          <ReservaDeEmergenciaForm />
        ) : (
          <InputField
            id="nome"
            name="nome"
            label="Nome"
            icon={faTag}
            placeholder="Digite o nome do ativo"
            maxLength={30}
          />
        )}


        {tipoAtivo === "investimentos" && tipoInvestimento === "tesouro_direto" && (
          <TesouroDiretoForm />
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "renda_fixa" && (
          <RendaFixaForm riscoOptions={riscoOptions} />
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "renda_variavel" && (
          <RendaVariavelForm riscoOptions={riscoOptions} />
        )}

        {tipoAtivo === "investimentos" &&
          tipoInvestimento !== "tesouro_direto" &&
          tipoInvestimento !== "renda_fixa" &&
          tipoInvestimento !== "renda_variavel" &&
          tipoInvestimento !== "" && (
            <>
              <RiskSelectField
                id="categoriaRisco"
                name="categoriaRisco"
                label="Nível de risco"
                options={RISCO_BAIXO_MEDIO_ALTO}
                defaultValue=""
              />

              <InputField
                id="valorAtual"
                name="valorAtual"
                label="Valor atual (R$)"
                icon={faDollarSign}
                type="text"
                inputMode="decimal"
                placeholder="R$ 0,00"
              />
            </>
          )}

        {['conta_corrente', 'meu_negocio'].includes(tipoAtivo) && (
          <SelectField
            id="tipoFonteRenda"
            name="tipoFonteRenda"
            label="Tipo de Fonte de Renda"
            icon={faList}
            options={ATIVOS_FONTE_RENDA_OPTIONS}
            onChange={(value) => setTipoFonteRenda(value)}
            defaultValue=""
          />
        )}

        {tipoAtivo === 'contas_a_receber' && (
          <ContasAReceberForm
            categoriaContasAReceber={categoriaContasAReceber}
            categoriasDisponiveis={categoriasDisponiveis}
            ativosFiltrados={getAtivosFiltrados()}
            ativoVinculado={ativoVinculado}
            onCategoriaChange={(value) => setCategoriaContasAReceber(value)}
            onAtivoVinculadoChange={(value) => setAtivoVinculado(value)}
          />
        )}

        {tipoAtivo !== "" && tipoAtivo !== "investimentos" && tipoAtivo !== "reserva_emergencia" && (
          <InputField
            id="valorAtual"
            name="valorAtual"
            label="Valor atual (R$)"
            icon={faDollarSign}
            type="text"
            inputMode="decimal"
            placeholder="R$ 0,00"
          />
        )}

        <footer className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-30 rounded-full bg-blue-400 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            Salvar
          </button>
        </footer>
      </form>
    </main>
  );
}