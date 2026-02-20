import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faList,
  faShield,
  faTag,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "../../../../shared/SelectField/selectField";
import InputField from "../../../../shared/InputField/inputField";
import { useAlert } from "../../../../shared/Alert/AlertContext";
import Loading from "../../../../shared/Loading/Loading";

import {
  ATIVOS_CATEGORIA_INVESTIMENTO_OPTIONS,
  ATIVOS_FONTE_RENDA_OPTIONS,
  ATIVOS_TIPO_OPTIONS,
  RISCO_BAIXO,
  RISCO_BAIXO_MEDIO,
  RISCO_BAIXO_MEDIO_ALTO,
  RISCO_MEDIO_ALTO,
} from "../../../../const/ativos";

import { TesouroDiretoForm } from "./components/tesouroDiretoForm";
import { RendaFixaForm } from "./components/rendaFixaForm";
import { RendaVariavelForm } from "./components/rendaVariavelForm";

const API_URL = import.meta.env.VITE_API_URL;

interface RiskFieldProps {
  id: string;
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

function RiskSelectField({ id, name, label, options, onChange, defaultValue = "" }: RiskFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
        <FontAwesomeIcon icon={faShield} className="text-gray-400" />
        <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor={id}>{label}</label>
        <select
          id={id}
          name={name}
          className="w-full bg-transparent outline-none"
          defaultValue={defaultValue}
          onChange={(event) => onChange?.(event.target.value)}
        >
          <option value="" disabled>Selecione</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function AtivosCreate() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [tipoAtivo, setTipoAtivo] = useState("");
  const [tipoInvestimento, setTipoInvestimento] = useState("");
  const [tipoAtivoRendaFixa, setTipoAtivoRendaFixa] = useState("");
  const [tipoRendaVariavel, setTipoRendaVariavel] = useState("");
  const [tipoFonteRenda, setTipoFonteRenda] = useState("");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const nome = formData.get("nome") as string;
    const tipo = formData.get("tipo") as string;

    if (!nome || !tipo) {
      showAlert("Por favor, preencha todos os campos obrigatórios.", "error");
      return;
    }

    try {
      setIsLoading(true);
      
      const payload: any = {
        nome,
        tipo,
      };

      // Adicionar tipoFonteRenda se necessário
      if (tipoFonteRenda) {
        payload.tipoFonteRenda = tipoFonteRenda;
      }

      // Para ativos simples
      if (tipo !== "investimentos") {
        const valorAtual = parseFloat((formData.get("valorAtual") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0");
        payload.valorAtual = valorAtual;
      }

      // Para investimentos
      if (tipo === "investimentos") {
        payload.tipoInvestimento = tipoInvestimento;

        if (tipoInvestimento === "tesouro_direto") {
          payload.tesouroDireto = {
            tipoTesouro: formData.get("tipoTesouro"),
            valorInvestido: parseFloat((formData.get("valorInvestido") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0"),
            valorAtual: parseFloat((formData.get("valorAtual") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0"),
            dataCompra: formData.get("dataCompra"),
            dataVencimento: formData.get("dataVencimento"),
            corretora: formData.get("corretora"),
            taxaRentabilidade: parseFloat((formData.get("taxaRentabilidade") as string) || "0"),
          };
        } else if (tipoInvestimento === "renda_fixa") {
          payload.rendaFixa = {
            tipoAtivoRendaFixa: formData.get("tipoAtivoRendaFixa"),
            valorInvestido: parseFloat((formData.get("valorInvestido") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0"),
            valorAtual: parseFloat((formData.get("valorAtual") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0"),
            corretora: formData.get("corretora"),
            dataCompra: formData.get("dataCompra"),
            dataVencimento: formData.get("dataVencimento"),
            tipoTaxa: formData.get("tipoTaxa"),
            taxaContratada: formData.get("taxaContratada") ? parseFloat(formData.get("taxaContratada") as string) : undefined,
            percentualCdi: formData.get("percentualCdi") ? parseFloat(formData.get("percentualCdi") as string) : undefined,
            cdiAtual: formData.get("cdiAtual") ? parseFloat(formData.get("cdiAtual") as string) : undefined,
            ipcaTaxa: formData.get("ipcaTaxa") ? parseFloat(formData.get("ipcaTaxa") as string) : undefined,
            categoriaRiscoRendaFixa: formData.get("categoriaRisco"),
            isento: formData.get("isento") === "on",
          };
        } else if (tipoInvestimento === "renda_variavel") {
          payload.rendaVariavel = {
            tipoRendaVariavel: formData.get("tipoRendaVariavel"),
            quantidade: parseFloat((formData.get("quantidade") as string) || "0"),
            precoMedio: parseFloat((formData.get("precoMedio") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0"),
            valorAtual: parseFloat((formData.get("valorAtual") as string)?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0"),
            corretora: formData.get("corretora"),
            dataCompra: formData.get("dataCompra"),
            categoriaRiscoRendaVariavel: formData.get("categoriaRisco"),
          };
        }
      }

      const response = await fetch(
        `${API_URL}/api/ativos${tipo === "investimentos" ? "/completo" : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar ativo");
      }

      showAlert("Ativo criado com sucesso!", "success");
      setTimeout(() => {
        navigate("/patrimonio");
      }, 1500);
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Erro ao criar ativo. Tente novamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="m-4 p-4">
      <Loading isLoading={isLoading} message="Criando ativo..." />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="nome"
          name="nome"
          label="Nome"
          icon={faTag}
          placeholder="Nome do ativo"
          maxLength={30}
        />

        <SelectField
          id="tipo"
          name="tipo"
          label="Tipo"
          icon={faList}
          options={ATIVOS_TIPO_OPTIONS}
          onChange={(value) => setTipoAtivo(value)}
          defaultValue=""
        />

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

        {tipoAtivo !== "" && tipoAtivo !== "investimentos" && (
          <InputField
            id="valorAtual"
            name="valorAtual"
            label="Valor atual"
            icon={faDollarSign}
            type="text"
            inputMode="decimal"
            placeholder="R$ 0,00"
          />
        )}

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
                label="Valor atual"
                icon={faDollarSign}
                type="text"
                inputMode="decimal"
                placeholder="R$ 0,00"
              />
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-30 rounded-full bg-green-700 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            Salvar Ativo
          </button>
        </form>
      </main>
    );
}