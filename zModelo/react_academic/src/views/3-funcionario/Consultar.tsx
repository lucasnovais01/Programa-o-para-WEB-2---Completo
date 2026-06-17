import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import "../../assets/css/7-form.css";
import { apiGetFuncionario } from "../../services/3-funcionario/api/api.funcionario";
import { FUNCIONARIO } from "../../services/3-funcionario/constants/funcionario.constants";
import type { Funcionario } from "../../services/3-funcionario/type/funcionario";
import { ROTA } from "../../services/router/url";

/**
 * ========================================================================
 * COMPONENTE: ConsultarFuncionario
 * ========================================================================
 * Propósito: Exibir os dados de um funcionário em modo somente leitura
 *
 * IMPORTANTE - Por que precisa de :idUsuario?
 * - Funcionário é uma especialização de HOSPEDE (herança)
 * - A chave primária é ID_USUARIO (FK para HOSPEDE.ID_USUARIO)
 * - Por isso a rota recebe :idUsuario e não :id
 * - Rota definida em router.tsx: ${ROTA.FUNCIONARIO.POR_ID}/:idUsuario
 *
 * Fluxo de Execução:
 * 1. Usuário clica em "Consultar" na lista (passa idUsuario na URL)
 * 2. useParams extrai idUsuario da URL
 * 3. useEffect carrega dados do backend assim que componente monta
 * 4. Renderiza campos somente leitura com os dados
 * ========================================================================
 */

export default function ConsultarFuncionario() {
  // CRÍTICO: Extrair :idUsuario da URL (não :id)
  // Correspondência com router.tsx: `${ROTA.FUNCIONARIO.POR_ID}/:idUsuario`
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getInputClass = () => {
    return "form-control app-label mt-2";
  };

  /**
   * useEffect Hook - Carregamento de Dados
   *
   * Por que precisa disso?
   * - React precisa buscar dados do backend quando componente monta
   * - Sem o useEffect, a página ficaria branca/vazia
   * - O spinner exibe "Carregando..." enquanto aguarda resposta
   *
   * Fluxo:
   * 1. ✓ Validação: Existe idUsuario na URL?
   * 2. ✓ Requisição: GET /sistema/3-funcionario/por-id/{idUsuario}
   * 3. ✓ Tratamento: Armazena resposta em setModel(response.data.dados)
   * 4. ✓ Erro: Se requisição falhar, mostra mensagem de erro
   * 5. ✓ Limpeza: Desativa spinner (setLoading(false)) em qualquer caso
   *
   * IMPORTANTE: Adicionar [idUsuario] na dependência!
   * - Se URL mudar para outro funcionário, useEffect roda novamente
   * - Sem isso, dados da URL anterior continuam na tela
   */
  useEffect(() => {
    async function getFuncionario() {
      // VALIDAÇÃO CRÍTICA: Sem idUsuario, não há ID para buscar
      // Se esta validação falhar = erro de roteamento (bug)
      if (!idUsuario) {
        setError("ID do funcionário não fornecido");
        setLoading(false);
        return; // Sai da função para evitar requisição com Number(undefined) = NaN
      }

      try {
        // GET: Busca um funcionário específico pelo ID
        // Endpoint: GET /sistema/3-funcionario/por-id/{idUsuario}
        const response = await apiGetFuncionario(Number(idUsuario));

        // response.data.dados contém:
        // { idUsuario, nomeLogin, codigoFuncao, dataContratacao, ativo }
        if (response.data.dados) {
          setModel(response.data.dados); // Armazena dados para renderizar
        } else {
          setError("Funcionário não encontrado");
        }
      } catch (err: any) {
        console.error(err);
        setError("Erro ao carregar funcionário");
      } finally {
        // IMPORTANTE: Executa sempre, quer sucesso ou erro
        // Remove o spinner de "Carregando..."
        setLoading(false);
      }
    }

    getFuncionario();
  }, [idUsuario]); // Dependência: Se idUsuario mudar, recarrega dados

  const onCancel = () => {
    navigate(ROTA.FUNCIONARIO.LISTAR);
  };

  if (loading) {
    return (
      <div className="padraoPagina">
        <div className="container py-8 text-center">
          <i className="fas fa-spinner fa-spin text-4xl"></i>
          <p className="mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="padraoPagina">
        <div className="container py-8">
          <div className="card bg-red-50 border-l-4 border-red-600 p-6">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Erro</h2>
            <p className="text-red-700">
              {error || "Funcionário não encontrado"}
            </p>
            <NavLink
              to={ROTA.FUNCIONARIO.LISTAR}
              className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
            >
              ← Voltar para lista
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="padraoPagina">
      <nav className="breadcrumb">
        <div className="container flex items-center space-x-2 text-sm">
          <NavLink
            to="/sistema/dashboard"
            className="text-blue-600 hover:text-blue-700"
          >
            Home
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <NavLink
            to={ROTA.FUNCIONARIO.LISTAR}
            className="text-blue-600 hover:text-blue-700"
          >
            Funcionários
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Consultar</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-search text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {FUNCIONARIO.TITULO.CONSULTAR}
          </h1>
          <p className="text-xl">Detalhes do funcionário</p>
        </div>
      </section>

      <main className="container py-8">
        <div
          className="card animated fadeInDown"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={FUNCIONARIO.FIELDS.ID} className="appLabel">
                ID do Usuário
              </label>
              <div className="form-field-wrapper">
                <input
                  id={FUNCIONARIO.FIELDS.ID}
                  name={FUNCIONARIO.FIELDS.ID}
                  type="number"
                  value={model?.idUsuario || ""}
                  className={getInputClass()}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor={FUNCIONARIO.FIELDS.NOME_LOGIN}
                className="appLabel"
              >
                {FUNCIONARIO.LABEL.NOME_LOGIN}
              </label>
              <div className="form-field-wrapper">
                <input
                  id={FUNCIONARIO.FIELDS.NOME_LOGIN}
                  name={FUNCIONARIO.FIELDS.NOME_LOGIN}
                  type="text"
                  value={model?.nomeLogin || ""}
                  className={getInputClass()}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor={FUNCIONARIO.FIELDS.EMAIL}
                className="appLabel"
              >
                {FUNCIONARIO.LABEL.EMAIL}
              </label>
              <div className="form-field-wrapper">
                <input
                  id={FUNCIONARIO.FIELDS.EMAIL}
                  name={FUNCIONARIO.FIELDS.EMAIL}
                  type="email"
                  value={model?.email || ""}
                  className={getInputClass()}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor={FUNCIONARIO.FIELDS.CODIGO_FUNCAO}
                className="appLabel"
              >
                {FUNCIONARIO.LABEL.CODIGO_FUNCAO}
              </label>
              <div className="form-field-wrapper">
                <input
                  id={FUNCIONARIO.FIELDS.CODIGO_FUNCAO}
                  name={FUNCIONARIO.FIELDS.CODIGO_FUNCAO}
                  type="number"
                  value={model?.codigoFuncao || ""}
                  className={getInputClass()}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor={FUNCIONARIO.FIELDS.DATA_CONTRATACAO}
                className="appLabel"
              >
                {FUNCIONARIO.LABEL.DATA_CONTRATACAO}
              </label>
              <div className="form-field-wrapper">
                <input
                  id={FUNCIONARIO.FIELDS.DATA_CONTRATACAO}
                  name={FUNCIONARIO.FIELDS.DATA_CONTRATACAO}
                  type="date"
                  value={
                    typeof model?.dataContratacao === "string"
                      ? model.dataContratacao
                      : ""
                  }
                  className={getInputClass()}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={FUNCIONARIO.FIELDS.ATIVO} className="appLabel">
                {FUNCIONARIO.LABEL.ATIVO}
              </label>
              <div className="form-field-wrapper">
                <input
                  id={FUNCIONARIO.FIELDS.ATIVO}
                  name={FUNCIONARIO.FIELDS.ATIVO}
                  type="text"
                  value={model?.ativo === 1 ? "Ativo" : "Inativo"}
                  className={getInputClass()}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              id="cancel"
              type="button"
              onClick={onCancel}
              className="btn btn-cancel"
              title="Voltar"
            >
              <span className="btn-icon">
                <i className="fas fa-arrow-left"></i>
              </span>
              Voltar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
