import { useState, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faCalendarDays,
  faChartLine,
  faClock,
  faDollarSign,
  faHashtag,
  faList,
  faPercent,
  faShield,
  faTag,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

import { formatValue } from '../../../../utils/formatValue'

// Componentes reutilizáveis
interface FieldProps {
  id: string;
  name: string;
  label: string;
  icon: IconDefinition;
  type?: string;
  inputMode?: string;
  placeholder?: string;
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
}

function InputField({ id, name, label, icon, type = "text", inputMode, placeholder, maxLength, readOnly, disabled }: FieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
        <FontAwesomeIcon icon={icon} className="text-gray-400" />
        <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor={id}>{label}</label>
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          className="w-full bg-transparent outline-none text-right"
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

interface SelectFieldProps extends Omit<FieldProps, 'type'> {
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

function SelectField({ id, name, label, icon, options, onChange, defaultValue = "" }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
        <FontAwesomeIcon icon={icon} className="text-gray-400" />
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

interface AlertBoxProps {
  children: ReactNode;
  type?: 'info' | 'success' | 'warning';
}

function AlertBox({ children, type = 'info' }: AlertBoxProps) {
  const styles = {
    info: 'bg-blue-50 border border-gray-200',
    success: 'bg-green-50 text-green-700',
    warning: 'rounded-lg px-3 py-2 text-xs',
  };
  
  return (
    <div className={`rounded-lg px-3 py-2 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}

export default function AtivosCreate() {
  const [tipoAtivo, setTipoAtivo] = useState("");
  const [tipoInvestimento, setTipoInvestimento] = useState("");
  const [tipoTesouro, setTipoTesouro] = useState("");
  const [tipoTaxa, setTipoTaxa] = useState("");
  const [tipoAtivoRendaFixa, setTipoAtivoRendaFixa] = useState("");
  const [tipoDebenture, setTipoDebenture] = useState("");
  const [tipoRendaVariavel, setTipoRendaVariavel] = useState("");
  const [categoriaRisco, setCategoriaRisco] = useState("");

  const getRiscoOptions = () => {
    if (tipoInvestimento === "tesouro_direto") {
      return [{ value: "baixo", label: "Baixo" }];
    } else if (tipoInvestimento === "renda_fixa") {
      if (["lci", "lca", "cri", "cra"].includes(tipoAtivoRendaFixa)) {
        return [{ value: "baixo", label: "Baixo" }];
      } else if (tipoAtivoRendaFixa === "cdb" || tipoAtivoRendaFixa === "lc") {
        return [
          { value: "baixo", label: "Baixo" },
          { value: "medio", label: "Médio" }
        ];
      } else if (tipoAtivoRendaFixa === "debenture") {
        return [
          { value: "medio", label: "Médio" },
          { value: "alto", label: "Alto" }
        ];
      } else {
        return [
          { value: "baixo", label: "Baixo" },
          { value: "medio", label: "Médio" },
          { value: "alto", label: "Alto" }
        ];
      }
    } else if (tipoInvestimento === "renda_variavel") {
      if (tipoRendaVariavel === "acoes") {
        return [
          { value: "medio", label: "Médio" },
          { value: "alto", label: "Alto" }
        ];
      } else if (tipoRendaVariavel === "fii") {
        return [
          { value: "baixo", label: "Baixo" },
          { value: "medio", label: "Médio" }
        ];
      } else if (tipoRendaVariavel === "etf") {
        return [
          { value: "baixo", label: "Baixo" },
          { value: "medio", label: "Médio" },
          { value: "alto", label: "Alto" }
        ];
      }
      return [
        { value: "baixo", label: "Baixo" },
        { value: "medio", label: "Médio" },
        { value: "alto", label: "Alto" }
      ];
    }
    return [
      { value: "baixo", label: "Baixo" },
      { value: "medio", label: "Médio" },
      { value: "alto", label: "Alto" }
    ];
  };

  const shouldShowRisco = tipoAtivo === "investimentos" && tipoInvestimento !== "";
  const riscoOptions = shouldShowRisco ? getRiscoOptions() : [];

  const isIrIsentoRendaFixa =
    ["lci", "lca", "cri", "cra"].includes(tipoAtivoRendaFixa) ||
    (tipoAtivoRendaFixa === "debenture" && tipoDebenture === "incentivada");

  const isIrManualRendaFixa = tipoAtivoRendaFixa === "outros";

  const taxaTesouroPlaceholder =
    tipoTesouro === "tesouro_prefixado"
      ? "Taxa fixa (%)"
      : tipoTesouro === "tesouro_ipca"
        ? "IPCA + X%"
        : tipoTesouro === "tesouro_selic"
          ? "Selic"
          : "0,00%";

  return (
    <main className='m-4 p-4'>
      <form className="space-y-4">
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
          options={[
            { value: "conta_corrente", label: "Conta corrente" },
            { value: "meu_negocio", label: "Meu negocio" },
            { value: "investimentos", label: "Investimentos" },
            { value: "contas_a_receber", label: "Contas a receber" },
            { value: "reserva_emergencia", label: "Reserva de emergencia" },
            { value: "previdencia_privada", label: "Previdencia privada" },
            { value: "outros", label: "Outros" },
          ]}
          onChange={(value) => setTipoAtivo(value)}
          defaultValue=""
        />

        {tipoAtivo === "investimentos" && (
          <SelectField
            id="tipoInvestimento"
            name="tipoInvestimento"
            label="Categoria de investimento"
            icon={faList}
            options={[
              { value: "tesouro_direto", label: "Tesouro direto" },
              { value: "renda_fixa", label: "Renda fixa" },
              { value: "renda_variavel", label: "Renda variavel" },
              { value: "outros", label: "Outros" },
            ]}
            onChange={(value) => {
              setTipoInvestimento(value);
              setTipoTesouro("");
              setTipoTaxa("");
              setTipoRendaVariavel("");
            }}
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

        {tipoAtivo === "investimentos" && tipoInvestimento === "tesouro_direto" && (
          <>
            <SelectField
              id="tipoTesouro"
              name="tipoTesouro"
              label="Tipo de investimento"
              icon={faList}
              options={[
                { value: "tesouro_selic", label: "Tesouro Selic" },
                { value: "tesouro_ipca", label: "IPCA+" },
                { value: "tesouro_prefixado", label: "Prefixado" },
              ]}
              onChange={(value) => setTipoTesouro(value)}
              defaultValue=""
            />

            <InputField
              id="valorInvestido"
              name="valorInvestido"
              label="Valor investido"
              icon={faDollarSign}
              type="text"
              inputMode="decimal"
              placeholder="R$ 0,00"
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

            <InputField
              id="dataCompra"
              name="dataCompra"
              label="Data de compra"
              icon={faCalendarDays}
              type="date"
            />

            <InputField
              id="dataVencimento"
              name="dataVencimento"
              label="Data de vencimento"
              icon={faCalendarDays}
              type="date"
            />

            <InputField
              id="corretora"
              name="corretora"
              label="Corretora"
              icon={faBuildingColumns}
              placeholder="Nome da corretora"
            />

            <InputField
              id="taxaRentabilidade"
              name="taxaRentabilidade"
              label="Taxa de rentabilidade"
              icon={faChartLine}
              type="text"
              inputMode="decimal"
              placeholder={taxaTesouroPlaceholder}
            />

            <AlertBox type="info">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faShield} className="text-blue-400" />
                <span className="text-sm text-blue-700">Nível de risco</span>
                <span className="text-xs text-blue-600 font-medium ml-auto">Baixo</span>
              </div>
            </AlertBox>
          </>
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "renda_fixa" && (
          <>
            <SelectField
              id="tipoAtivoRendaFixa"
              name="tipoAtivoRendaFixa"
              label="Tipo de ativo"
              icon={faTag}
              options={[
                { value: "cdb", label: "CDB" },
                { value: "lci", label: "LCI" },
                { value: "lca", label: "LCA" },
                { value: "lc", label: "LC" },
                { value: "cri", label: "CRI" },
                { value: "cra", label: "CRA" },
                { value: "debenture", label: "Debenture" },
                { value: "outros", label: "Outros" },
              ]}
              onChange={(value) => {
                setTipoAtivoRendaFixa(value);
                setTipoTaxa("");
                setTipoDebenture("");
              }}
              defaultValue=""
            />

            {tipoAtivoRendaFixa === "debenture" && (
              <SelectField
                id="tipoDebenture"
                name="tipoDebenture"
                label="Tipo de debenture"
                icon={faList}
                options={[
                  { value: "comum", label: "Comum" },
                  { value: "incentivada", label: "Incentivada" },
                ]}
                onChange={(value) => setTipoDebenture(value)}
                defaultValue=""
              />
            )}

            <InputField
              id="valorInvestido"
              name="valorInvestido"
              label="Valor investido"
              icon={faDollarSign}
              type="text"
              inputMode="decimal"
              placeholder="R$ 0,00"
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

            <InputField
              id="corretora"
              name="corretora"
              label="Corretora"
              icon={faBuildingColumns}
              placeholder="Nome da corretora"
            />

            <InputField
              id="dataCompra"
              name="dataCompra"
              label="Data de compra"
              icon={faCalendarDays}
              type="date"
            />

            <InputField
              id="dataVencimento"
              name="dataVencimento"
              label="Data de vencimento"
              icon={faCalendarDays}
              type="date"
            />

            <SelectField
              id="tipoTaxa"
              name="tipoTaxa"
              label="Tipo de taxa"
              icon={faList}
              options={[
                { value: "prefixado", label: "Prefixado" },
                { value: "pos_fixado_cdi", label: "% CDI" },
                { value: "ipca", label: "IPCA + taxa" },
              ]}
              onChange={(value) => setTipoTaxa(value)}
              defaultValue=""
            />

            {tipoTaxa === "prefixado" && (
              <InputField
                id="taxaContratada"
                name="taxaContratada"
                label="Taxa contratada"
                icon={faChartLine}
                type="text"
                inputMode="decimal"
                placeholder="Taxa anual (%)"
              />
            )}

            {tipoTaxa === "pos_fixado_cdi" && (
              <>
                <InputField
                  id="percentualCdi"
                  name="percentualCdi"
                  label="% do CDI"
                  icon={faPercent}
                  type="text"
                  inputMode="decimal"
                  placeholder="110%"
                />

                <InputField
                  id="cdiAtual"
                  name="cdiAtual"
                  label="CDI atual"
                  icon={faPercent}
                  type="text"
                  placeholder="10,65% a.a"
                  readOnly
                />
              </>
            )}

            {tipoTaxa === "ipca" && (
              <InputField
                id="ipcaTaxa"
                name="ipcaTaxa"
                label="IPCA + taxa"
                icon={faPercent}
                type="text"
                inputMode="decimal"
                placeholder="IPCA + 0,00%"
              />
            )}

            {isIrIsentoRendaFixa ? (
              <AlertBox type="success">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Isento de IR</span>
                </div>
              </AlertBox>
            ) : (
              <InputField
                id="irEstimado"
                name="irEstimado"
                label="IR estimado"
                icon={faPercent}
                type="text"
                inputMode="decimal"
                placeholder="0,00%"
                readOnly={!isIrManualRendaFixa}
              />
            )}

            <RiskSelectField
              id="categoriaRiscoRendaFixa"
              name="categoriaRiscoRendaFixa"
              label="Nível de risco"
              options={riscoOptions}
              onChange={(value) => setCategoriaRisco(value)}
              defaultValue=""
            />

            <InputField
              id="valorFinalEstimado"
              name="valorFinalEstimado"
              label="Valor final estimado"
              icon={faDollarSign}
              type="text"
              inputMode="decimal"
              placeholder="R$ 0,00"
              readOnly
            />
          </>
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "renda_variavel" && (
          <>
            <SelectField
              id="tipoRendaVariavel"
              name="tipoRendaVariavel"
              label="Tipo de ativo"
              icon={faList}
              options={[
                { value: "acoes", label: "Acoes" },
                { value: "fii", label: "FII" },
                { value: "etf", label: "ETF" },
              ]}
              onChange={(value) => setTipoRendaVariavel(value)}
              defaultValue=""
            />

            <InputField
              id="quantidade"
              name="quantidade"
              label="Quantidade"
              icon={faHashtag}
              type="number"
              inputMode="numeric"
              placeholder="0"
            />

            <InputField
              id="precoMedio"
              name="precoMedio"
              label="Preco medio"
              icon={faDollarSign}
              type="text"
              inputMode="decimal"
              placeholder="R$ 0,00"
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

            <InputField
              id="corretora"
              name="corretora"
              label="Corretora"
              icon={faBuildingColumns}
              placeholder="Nome da corretora"
            />

            <RiskSelectField
              id="categoriaRiscoRendaVariavel"
              name="categoriaRiscoRendaVariavel"
              label="Nível de risco"
              options={riscoOptions}
              onChange={(value) => setCategoriaRisco(value)}
              defaultValue=""
            />

            {tipoRendaVariavel === "acoes" && (
              <>
                <InputField
                  id="dataCompra"
                  name="dataCompra"
                  label="Data de compra"
                  icon={faCalendarDays}
                  type="date"
                />

                <InputField
                  id="dividendosRecebidos"
                  name="dividendosRecebidos"
                  label="Dividendos recebidos"
                  icon={faDollarSign}
                  type="text"
                  inputMode="decimal"
                  placeholder="R$ 0,00"
                />

                <SelectField
                  id="irEstimado"
                  name="irEstimado"
                  label="IR estimado"
                  icon={faPercent}
                  options={[
                    { value: "15", label: "15% (normal)" },
                    { value: "20", label: "20% (day trade)" },
                  ]}
                  defaultValue=""
                />
              </>
            )}

            {tipoRendaVariavel === "fii" && (
              <>
                <InputField
                  id="dividendYield"
                  name="dividendYield"
                  label="Dividend yield"
                  icon={faPercent}
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00%"
                />

                <InputField
                  id="irEstimado"
                  name="irEstimado"
                  label="IR estimado"
                  icon={faPercent}
                  type="text"
                  inputMode="decimal"
                  placeholder="20%"
                />
              </>
            )}

            {tipoRendaVariavel === "etf" && (
              <SelectField
                id="irEstimado"
                name="irEstimado"
                label="IR estimado"
                icon={faPercent}
                options={[
                  { value: "15", label: "15% (normal)" },
                  { value: "20", label: "20% (day trade)" },
                ]}
                defaultValue=""
              />
            )}
          </>
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento !== "tesouro_direto" && tipoInvestimento !== "renda_fixa" && tipoInvestimento !== "renda_variavel" && tipoInvestimento !== "" && (
          <>
            <RiskSelectField
              id="categoriaRisco"
              name="categoriaRisco"
              label="Nível de risco"
              options={[
                { value: "baixo", label: "Baixo" },
                { value: "medio", label: "Médio" },
                { value: "alto", label: "Alto" },
              ]}
              onChange={(value) => setCategoriaRisco(value)}
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

            <InputField
              id="corretora"
              name="corretora"
              label="Corretora"
              icon={faBuildingColumns}
              placeholder="Nome da corretora"
            />

            <InputField
              id="dataCompra"
              name="dataCompra"
              label="Data de compra"
              icon={faCalendarDays}
              type="date"
            />

            <InputField
              id="dataVencimento"
              name="dataVencimento"
              label="Data de vencimento"
              icon={faCalendarDays}
              type="date"
            />

            <InputField
              id="quantidade"
              name="quantidade"
              label="Quantidade"
              icon={faHashtag}
              type="number"
              inputMode="numeric"
              placeholder="0"
            />

            <InputField
              id="irEstimado"
              name="irEstimado"
              label="IR estimado"
              icon={faPercent}
              type="text"
              inputMode="decimal"
              placeholder="0,00%"
            />

            <InputField
              id="valorFinalEstimado"
              name="valorFinalEstimado"
              label="Valor final estimado"
              icon={faDollarSign}
              type="text"
              inputMode="decimal"
              placeholder="R$ 0,00"
            />

            <InputField
              id="anosRentabilidade"
              name="anosRentabilidade"
              label="Anos de rentabilidade"
              icon={faClock}
              type="number"
              inputMode="numeric"
              placeholder="0"
            />

            <InputField
              id="anosParaVencer"
              name="anosParaVencer"
              label="Anos para vencer"
              icon={faClock}
              type="number"
              inputMode="numeric"
              placeholder="0"
            />
          </>
        )}
      </form>
    </main>
  )
}