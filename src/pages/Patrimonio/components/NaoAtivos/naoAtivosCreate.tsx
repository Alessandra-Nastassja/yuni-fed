import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faDollarSign, faTag } from "@fortawesome/free-solid-svg-icons";

import SelectField from "../../../../shared/SelectField/selectField";
import InputField from "../../../../shared/InputField/inputField";
import { useAlert } from "../../../../shared/Alert/AlertContext";
import Loading from "../../../../shared/Loading/Loading";
import { applyMoneyMask } from "../../../../utils/currency";
import { NAO_ATIVOS_TIPO_OPTIONS } from "../../../../const/ativos";

const API_URL = import.meta.env.VITE_API_URL;

export default function NaoAtivosCreate() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    // Aplicar máscara de moeda no campo de valor atual
    const valorAtualInput = document.getElementById("valorAtual");
    if (valorAtualInput) {
      applyMoneyMask("valorAtual");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const tipoValue = formData.get("tipo") as string;
    const nomeValue = formData.get("nome") as string;
    const valorAtualRaw = formData.get("valorAtual") as string;

    // Validação: tipo é obrigatório
    if (!tipoValue) {
      showAlert("Por favor, selecione o tipo de não ativo.", "error");
      return;
    }

    // Validação: se tipo for "outros", nome é obrigatório
    if (tipoValue === "outros" && !nomeValue) {
      showAlert("Por favor, preencha o nome do não ativo.", "error");
      return;
    }

    // Validação: valorAtual é obrigatório
    if (!valorAtualRaw) {
      showAlert("Por favor, preencha o valor atual.", "error");
      return;
    }

    const valorAtual = parseFloat(
      valorAtualRaw
        .replace(/[^\d,.-]/g, "")
        .replace(",", ".") || "0"
    );

    try {
      setIsLoading(true);

      const payload: any = {
        tipo: tipoValue,
        valorAtual,
      };

      // Adicionar nome apenas se tipo for "outros"
      if (tipoValue === "outros") {
        payload.nome = nomeValue;
      }

      const response = await fetch(`${API_URL}/nao-ativos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar não ativo");
      }

      showAlert(
        `Não ativo "${tipoValue === "outros" ? nomeValue : NAO_ATIVOS_TIPO_OPTIONS.find(opt => opt.value === tipoValue)?.label || tipoValue}" criado com sucesso!`,
        "success"
      );

      setTimeout(() => {
        navigate("/patrimonio");
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar não ativo:", error);
      showAlert("Erro ao criar não ativo. Tente novamente.", "error");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="p-4">
      <Loading isLoading={isLoading} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Tipo */}
        <SelectField
          id="tipo"
          name="tipo"
          label="Tipo"
          placeholder="Selecione o tipo"
          icon={faTag}
          options={NAO_ATIVOS_TIPO_OPTIONS}
          onChange={(value) => setTipo(value)}
        />

        {/* Campo Nome - exibido apenas quando tipo === "outros" */}
        {['outros', 'objeto_de_valor', 'veiculos', 'imoveis'].includes(tipo) && (
          <InputField
            id="nome"
            name="nome"
            label="Nome"
            placeholder="Digite o nome do não ativo"
            icon={faTag}
          />
        )}

        {/* Campo Valor Atual */}
        <InputField
          id="valorAtual"
          name="valorAtual"
          label="Valor Atual"
          placeholder="R$ 0,00"
          icon={faDollarSign}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="w-30 rounded-full bg-blue-400 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}