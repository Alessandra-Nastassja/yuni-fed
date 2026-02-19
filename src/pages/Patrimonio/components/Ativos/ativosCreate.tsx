import { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

export default function AtivosCreate() {
  const [tipoAtivo, setTipoAtivo] = useState("");
  const [tipoInvestimento, setTipoInvestimento] = useState("");
  const [tipoTesouro, setTipoTesouro] = useState("");
  const [tipoTaxa, setTipoTaxa] = useState("");
  const [tipoAtivoRendaFixa, setTipoAtivoRendaFixa] = useState("");
  const [tipoDebenture, setTipoDebenture] = useState("");
  const [tipoRendaVariavel, setTipoRendaVariavel] = useState("");

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
        <div className="space-y-1">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
            <FontAwesomeIcon icon={faTag} className="text-gray-400" />
            <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              className="w-full bg-transparent outline-none"
              placeholder="Nome do ativo"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
            <FontAwesomeIcon icon={faList} className="text-gray-400" />
            <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              className="w-full bg-transparent outline-none"
              defaultValue=""
              onChange={(event) => setTipoAtivo(event.target.value)}
            >
              <option value="" disabled>Selecione</option>
              <option value="conta_corrente" >Conta corrente</option>
              <option value="meu_negocio" >Meu negocio</option>
              <option value="investimentos">Investimentos</option>
              <option value="contas_a_receber">Contas a receber</option>
              <option value="reserva_emergencia">Reserva de emergencia</option>
              <option value="previdencia_privada">Previdencia privada</option>
              <option value="outros">Outros</option>
            </select>
          </div>
        </div>

        {tipoAtivo === "investimentos" && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faList} className="text-gray-400" />
              <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="tipoInvestimento">Categoria de investimento</label>
              <select
                id="tipoInvestimento"
                name="tipoInvestimento"
                className="w-full bg-transparent outline-none"
                defaultValue=""
                onChange={(event) => {
                  setTipoInvestimento(event.target.value);
                  setTipoTesouro("");
                  setTipoTaxa("");
                  setTipoRendaVariavel("");
                }}
              >
                <option value="" disabled>Selecione</option>
                <option value="tesouro_direto">Tesouro direto</option>
                <option value="renda_fixa">Renda fixa</option>
                <option value="renda_variavel">Renda variavel</option>
                <option value="outros">Outros</option>
              </select>
            </div>
          </div>
        )}

        {tipoAtivo !== "" && tipoAtivo !== "investimentos" && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
              <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorAtual">Valor atual</label>
              <input
                id="valorAtual"
                name="valorAtual"
                type="text"
                inputMode="decimal"
                className="w-full bg-transparent outline-none text-right"
                placeholder="R$ 0,00"
              />
            </div>
          </div>
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "tesouro_direto" && (
          <>
            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faList} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="tipoTesouro">Tipo de investimento</label>
                <select
                  id="tipoTesouro"
                  name="tipoTesouro"
                  className="w-full bg-transparent outline-none"
                  defaultValue=""
                  onChange={(event) => setTipoTesouro(event.target.value)}
                >
                  <option value="" disabled>Selecione</option>
                  <option value="tesouro_selic">Tesouro Selic</option>
                  <option value="tesouro_ipca">IPCA+</option>
                  <option value="tesouro_prefixado">Prefixado</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorInvestido">Valor investido</label>
                <input
                  id="valorInvestido"
                  name="valorInvestido"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorAtual">Valor atual</label>
                <input
                  id="valorAtual"
                  name="valorAtual"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="dataCompra">Data de compra</label>
                <input
                  id="dataCompra"
                  name="dataCompra"
                  type="date"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="dataVencimento">Data de vencimento</label>
                <input
                  id="dataVencimento"
                  name="dataVencimento"
                  type="date"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faBuildingColumns} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="corretora">Corretora</label>
                <input
                  id="corretora"
                  name="corretora"
                  type="text"
                  className="w-full bg-transparent outline-none"
                  placeholder="Nome da corretora"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faChartLine} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="taxaRentabilidade">Taxa de rentabilidade</label>
                <input
                  id="taxaRentabilidade"
                  name="taxaRentabilidade"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder={taxaTesouroPlaceholder}
                />
              </div>
            </div>
          </>
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "renda_fixa" && (
          <>
            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faTag} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="tipoAtivoRendaFixa">Tipo de ativo</label>
                <select
                  id="tipoAtivoRendaFixa"
                  name="tipoAtivoRendaFixa"
                  className="w-full bg-transparent outline-none"
                  defaultValue=""
                  onChange={(event) => {
                    setTipoAtivoRendaFixa(event.target.value);
                    setTipoTaxa("");
                    setTipoDebenture("");
                  }}
                >
                  <option value="" disabled>Selecione</option>
                  <option value="cdb">CDB</option>
                  <option value="lci">LCI</option>
                  <option value="lca">LCA</option>
                  <option value="lc">LC</option>
                  <option value="cri">CRI</option>
                  <option value="cra">CRA</option>
                  <option value="debenture">Debenture</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>

            {tipoAtivoRendaFixa === "debenture" && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <FontAwesomeIcon icon={faList} className="text-gray-400" />
                  <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="tipoDebenture">Tipo de debenture</label>
                  <select
                    id="tipoDebenture"
                    name="tipoDebenture"
                    className="w-full bg-transparent outline-none"
                    defaultValue=""
                    onChange={(event) => setTipoDebenture(event.target.value)}
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="comum">Comum</option>
                    <option value="incentivada">Incentivada</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorInvestido">Valor investido</label>
                <input
                  id="valorInvestido"
                  name="valorInvestido"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorAtual">Valor atual</label>
                <input
                  id="valorAtual"
                  name="valorAtual"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faBuildingColumns} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="corretora">Corretora</label>
                <input
                  id="corretora"
                  name="corretora"
                  type="text"
                  className="w-full bg-transparent outline-none"
                  placeholder="Nome da corretora"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="dataCompra">Data de compra</label>
                <input
                  id="dataCompra"
                  name="dataCompra"
                  type="date"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="dataVencimento">Data de vencimento</label>
                <input
                  id="dataVencimento"
                  name="dataVencimento"
                  type="date"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faList} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="tipoTaxa">Tipo de taxa</label>
                <select
                  id="tipoTaxa"
                  name="tipoTaxa"
                  className="w-full bg-transparent outline-none"
                  defaultValue=""
                  onChange={(event) => setTipoTaxa(event.target.value)}
                >
                  <option value="" disabled>Selecione</option>
                  <option value="prefixado">Prefixado</option>
                  <option value="pos_fixado_cdi">% CDI</option>
                  <option value="ipca">IPCA + taxa</option>
                </select>
              </div>
            </div>

            {tipoTaxa === "prefixado" && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <FontAwesomeIcon icon={faChartLine} className="text-gray-400" />
                  <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="taxaContratada">Taxa contratada</label>
                  <input
                    id="taxaContratada"
                    name="taxaContratada"
                    type="text"
                    inputMode="decimal"
                    className="w-full bg-transparent outline-none text-right"
                    placeholder="Taxa anual (%)"
                  />
                </div>
              </div>
            )}

            {tipoTaxa === "pos_fixado_cdi" && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
                    <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="percentualCdi">% do CDI</label>
                    <input
                      id="percentualCdi"
                      name="percentualCdi"
                      type="text"
                      inputMode="decimal"
                      className="w-full bg-transparent outline-none text-right"
                      placeholder="110%"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
                    <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="cdiAtual">CDI atual</label>
                    <input
                      id="cdiAtual"
                      name="cdiAtual"
                      type="text"
                      className="w-full bg-transparent outline-none text-right text-gray-500"
                      placeholder="10,65% a.a"
                      readOnly
                    />
                  </div>
                </div>
              </>
            )}

            {tipoTaxa === "ipca" && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
                  <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="ipcaTaxa">IPCA + taxa</label>
                  <input
                    id="ipcaTaxa"
                    name="ipcaTaxa"
                    type="text"
                    inputMode="decimal"
                    className="w-full bg-transparent outline-none text-right"
                    placeholder="IPCA + 0,00%"
                  />
                </div>
              </div>
            )}

            {isIrIsentoRendaFixa ? (
              <div className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                Isento de IR
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
                  <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="irEstimado">IR estimado</label>
                  <input
                    id="irEstimado"
                    name="irEstimado"
                    type="text"
                    inputMode="decimal"
                    className="w-full bg-transparent outline-none text-right"
                    placeholder="0,00%"
                    readOnly={!isIrManualRendaFixa}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorFinalEstimado">Valor final estimado</label>
                <input
                  id="valorFinalEstimado"
                  name="valorFinalEstimado"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="R$ 0,00"
                  readOnly
                />
              </div>
            </div>
          </>
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento === "renda_variavel" && (
          <>
            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faList} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="tipoRendaVariavel">Tipo de ativo</label>
                <select
                  id="tipoRendaVariavel"
                  name="tipoRendaVariavel"
                  className="w-full bg-transparent outline-none"
                  defaultValue=""
                  onChange={(event) => setTipoRendaVariavel(event.target.value)}
                >
                  <option value="" disabled>Selecione</option>
                  <option value="acoes">Acoes</option>
                  <option value="fii">FII</option>
                  <option value="etf">ETF</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faHashtag} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="quantidade">Quantidade</label>
                <input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  inputMode="numeric"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="precoMedio">Preco medio</label>
                <input
                  id="precoMedio"
                  name="precoMedio"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorAtual">Valor atual</label>
                <input
                  id="valorAtual"
                  name="valorAtual"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faBuildingColumns} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="corretora">Corretora</label>
                <input
                  id="corretora"
                  name="corretora"
                  type="text"
                  className="w-full bg-transparent outline-none"
                  placeholder="Nome da corretora"
                />
              </div>
            </div>

            {tipoRendaVariavel === "acoes" && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                    <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="dataCompra">Data de compra</label>
                    <input
                      id="dataCompra"
                      name="dataCompra"
                      type="date"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                    <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="dividendosRecebidos">Dividendos recebidos</label>
                    <input
                      id="dividendosRecebidos"
                      name="dividendosRecebidos"
                      type="text"
                      inputMode="decimal"
                      className="w-full bg-transparent outline-none text-right"
                      placeholder="R$ 0,00"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
                    <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="irEstimado">IR estimado</label>
                    <select
                      id="irEstimado"
                      name="irEstimado"
                      className="w-full bg-transparent outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>Selecione</option>
                      <option value="15">15% (normal)</option>
                      <option value="20">20% (day trade)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {tipoRendaVariavel === "fii" && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
                    <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="dividendYield">Dividend yield</label>
                    <input
                      id="dividendYield"
                      name="dividendYield"
                      type="text"
                      inputMode="decimal"
                      className="w-full bg-transparent outline-none text-right"
                      placeholder="0,00%"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
                    <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="irEstimado">IR estimado</label>
                    <input
                      id="irEstimado"
                      name="irEstimado"
                      type="text"
                      inputMode="decimal"
                      className="w-full bg-transparent outline-none text-right"
                      placeholder="20%"
                    />
                  </div>
                </div>
              </>
            )}

            {tipoRendaVariavel === "etf" && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
                  <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="irEstimado">IR estimado</label>
                  <select
                    id="irEstimado"
                    name="irEstimado"
                    className="w-full bg-transparent outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="15">15% (normal)</option>
                    <option value="20">20% (day trade)</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}

        {tipoAtivo === "investimentos" && tipoInvestimento !== "tesouro_direto" && tipoInvestimento !== "renda_fixa" && tipoInvestimento !== "renda_variavel" && tipoInvestimento !== "" && (
          <>
            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faShield} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="categoriaRisco">Risco</label>
                <select
                  id="categoriaRisco"
                  name="categoriaRisco"
                  className="w-full bg-transparent outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Selecione</option>
                  <option value="baixo">Baixo</option>
                  <option value="medio">Medio</option>
                  <option value="alto">Alto</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorAtual">Valor atual</label>
                <input
                  id="valorAtual"
                  name="valorAtual"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faBuildingColumns} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="corretora">Corretora</label>
                <input
                  id="corretora"
                  name="corretora"
                  type="text"
                  className="w-full bg-transparent outline-none"
                  placeholder="Nome da corretora"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="dataCompra">Data de compra</label>
                <input
                  id="dataCompra"
                  name="dataCompra"
                  type="date"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="dataVencimento">Data de vencimento</label>
                <input
                  id="dataVencimento"
                  name="dataVencimento"
                  type="date"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faHashtag} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="quantidade">Quantidade</label>
                <input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  inputMode="numeric"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faPercent} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="irEstimado">IR estimado</label>
                <input
                  id="irEstimado"
                  name="irEstimado"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="0,00%"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="valorFinalEstimado">Valor final estimado</label>
                <input
                  id="valorFinalEstimado"
                  name="valorFinalEstimado"
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="anosRentabilidade">Anos de rentabilidade</label>
                <input
                  id="anosRentabilidade"
                  name="anosRentabilidade"
                  type="number"
                  inputMode="numeric"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                <label className="text-sm text-gray-600 whitespace-nowrap" htmlFor="anosParaVencer">Anos para vencer</label>
                <input
                  id="anosParaVencer"
                  name="anosParaVencer"
                  type="number"
                  inputMode="numeric"
                  className="w-full bg-transparent outline-none text-right"
                  placeholder="0"
                />
              </div>
            </div>
          </>
        )}
      </form>
    </main>
  )
}