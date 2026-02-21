import { useEffect } from "react";
import { applyMoneyMask } from "../utils/currency";
import { DATE_INPUT_IDS, TIMERS } from "../const/ativos";

/**
 * Hook para aplicar máscaras de moeda nos inputs especificados
 * @param inputIds - Array de IDs dos inputs que devem receber a máscara de moeda
 */
export const useMoneyMask = (inputIds: string[]) => {
  useEffect(() => {
    // Delay para garantir que os inputs estejam no DOM
    const timer = setTimeout(() => {
      inputIds.forEach((inputId) => {
        const input = document.getElementById(inputId);
        if (input) {
          applyMoneyMask(inputId);
        }
      });
    }, TIMERS.inputMaskDelay);

    return () => clearTimeout(timer);
  }, [inputIds]);
};

/**
 * Hook para gerenciar valores de inputs de data e executar callback
 * @param onDataChange - Callback executado quando datas mudam
 */
export const useDateInputListener = (
  onDataChange: (dataCompra: string, dataVencimento: string) => void
) => {
  useEffect(() => {
    const dataCompraInput = document.getElementById(
      DATE_INPUT_IDS.dataCompra
    ) as HTMLInputElement;
    const dataVencimentoInput = document.getElementById(
      DATE_INPUT_IDS.dataVencimento
    ) as HTMLInputElement;

    const handleDataChange = () => {
      const dataCompra = dataCompraInput?.value || "";
      const dataVencimento = dataVencimentoInput?.value || "";
      onDataChange(dataCompra, dataVencimento);
    };

    dataCompraInput?.addEventListener("change", handleDataChange);
    dataVencimentoInput?.addEventListener("change", handleDataChange);

    return () => {
      dataCompraInput?.removeEventListener("change", handleDataChange);
      dataVencimentoInput?.removeEventListener("change", handleDataChange);
    };
  }, [onDataChange]);
};

/**
 * Hook para gerenciar valores de inputs e executar callback
 * @param inputIds - Array de IDs dos inputs a monitorar
 * @param onValuesChange - Callback executado quando valores mudam
 */
export const useInputValueListener = (
  inputIds: string[],
  onValuesChange: (values: Record<string, string>) => void
) => {
  useEffect(() => {
    const inputs = inputIds.map(
      (id) => ({
        id,
        element: document.getElementById(id) as HTMLInputElement | null,
      })
    );

    const handleValuesChange = () => {
      const values: Record<string, string> = {};
      inputs.forEach(({ id, element }) => {
        if (element) {
          values[id] = element.value;
        }
      });
      onValuesChange(values);
    };

    inputs.forEach(({ element }) => {
      element?.addEventListener("input", handleValuesChange);
    });

    return () => {
      inputs.forEach(({ element }) => {
        element?.removeEventListener("input", handleValuesChange);
      });
    };
  }, [inputIds, onValuesChange]);
};

/**
 * Hook para gerenciar valor de um input específico e atualizar outro input
 * @param sourceInputId - ID do input que dispara a mudança
 * @param targetInputId - ID do input que será atualizado
 * @param calculateValue - Função que calcula o novo valor
 */
export const useCalculatedInputField = (
  sourceInputId: string,
  targetInputId: string,
  calculateValue: () => string | number
) => {
  useEffect(() => {
    const sourceInput = document.getElementById(sourceInputId);
    const targetInput = document.getElementById(targetInputId) as HTMLInputElement;

    const handleChange = () => {
      const newValue = calculateValue();
      if (targetInput) {
        targetInput.value = String(newValue);
      }
    };

    sourceInput?.addEventListener("input", handleChange);
    sourceInput?.addEventListener("change", handleChange);

    return () => {
      sourceInput?.removeEventListener("input", handleChange);
      sourceInput?.removeEventListener("change", handleChange);
    };
  }, [sourceInputId, targetInputId, calculateValue]);
};

/**
 * Hook para gerenciar cálculo automático com múltiplos inputs
 * @param triggerInputIds - Array de IDs dos inputs que disparam o cálculo
 * @param targetInputId - ID do input que será atualizado
 * @param calculateValue - Função que calcula o novo valor
 * @param dependencies - Dependências adicionais do useEffect
 */
export const useMultiInputCalculation = (
  triggerInputIds: string[],
  targetInputId: string,
  calculateValue: () => string | number,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const targetInput = document.getElementById(targetInputId) as HTMLInputElement;

    const handleChange = () => {
      const newValue = calculateValue();
      if (targetInput) {
        targetInput.value = String(newValue);
      }
    };

    const inputs = triggerInputIds.map((id) => document.getElementById(id));

    inputs.forEach((input) => {
      input?.addEventListener("input", handleChange);
      input?.addEventListener("change", handleChange);
    });

    return () => {
      inputs.forEach((input) => {
        input?.removeEventListener("input", handleChange);
        input?.removeEventListener("change", handleChange);
      });
    };
  }, [triggerInputIds, targetInputId, calculateValue, ...dependencies]);
};
