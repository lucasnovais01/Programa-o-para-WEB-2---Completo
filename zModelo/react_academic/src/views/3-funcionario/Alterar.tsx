import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import "../../assets/css/7-form.css";
import {
  apiGetFuncionario,
  apiPutFuncionario,
} from "../../services/3-funcionario/api/api.funcionario";
import { FUNCIONARIO } from "../../services/3-funcionario/constants/funcionario.constants";
import type { Funcionario } from "../../services/3-funcionario/type/funcionario";

import { apiGetFuncoes } from "../../services/2-funcao/api/api.funcao";
import { ROTA } from "../../services/router/url";
import type { Funcao } from "../../type/2-funcao";
import {
  createHandleChangeField,
  createShowMensagem,
  createValidateField,
} from "./zCamposAlterar";

/**
 * ========================================================================
 * COMPONENTE: AlterarFuncionario
 * ========================================================================
 * Propósito: Editar dados de um funcionário existente
 *
 * ARQUITETURA ESPECIAL DESTE MÓDULO:
 *
 * 1. HERANÇA HOSPEDE → FUNCIONARIO
 *    - Funcionário NÃO é entidade independente
 *    - É uma especialização de HOSPEDE onde TIPO=1
 *    - PK de FUNCIONARIO é ID_USUARIO (FK para HOSPEDE)
 *    - Por isso a rota recebe :idUsuario, não :id
 *
 * 2. POR QUE DOIS CARREGAMENTOS NO useEffect?
 *    a) apiGetFuncionario(idUsuario) → carrega dados do funcionário
 *    b) apiGetFuncoes() → carrega lista de funções para dropdown
 *    - Ambas precisam estar prontas para renderizar o formulário
 *    - loading só desativa quando ambas terminarem
 *
 * 3. POR QUE codigoFuncao É STRING?
 *    - codigoFuncao é FK para tabela FUNCAO (lookup table)
 *    - Em FUNCAO, CODIGO_FUNCAO é NUMBER(4) mas usamos como String
 *    - Por isso: value={model?.codigoFuncao || ""} (não 0)
 *    - E: codigoFuncao: model.codigoFuncao (sem Number())
 *
 * 4. POR QUE NÃO ENVIAR idUsuario NO PUT?
 *    - idUsuario é PK (Primary Key)
 *    - PKs nunca são atualizadas no banco de dados
 *    - Backend rejeita se tentar mudar a PK
 *    - Payload enviado: { nomeLogin, senha, codigoFuncao, dataContratacao, ativo }
 *    - idUsuario vem na URL: PUT /3-funcionario/{idUsuario}
 *
 * Fluxo:
 * 1. Usuário clica Alterar na lista (passa idUsuario)
 * 2. useEffect carrega dados do funcionário + lista de funções
 * 3. Formulário renderiza com dados preenchidos
 * 4. Usuário edita campos (onChange atualiza model)
 * 5. Ao clicar Salvar: validação → PUT /3-funcionario/{idUsuario}
 * 6. Se sucesso: volta para lista com toast
 * ========================================================================
 */

export default function AlterarFuncionario() {
  // CRÍTICO: Extrair :idUsuario da URL (não :id)
  // Correspondência com router.tsx: `${ROTA.FUNCIONARIO.ATUALIZAR}/:idUsuario`
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Funcionario | null>(null);
  const [errors, setErrors] = useState<Record<string, unknown>>({});
  const [funcoes, setFuncoes] = useState<Funcao[]>([]); // Lista de funções para dropdown
  const [loading, setLoading] = useState(true);

  // Funções de validação vêm de zCamposAlterar.ts
  const handleChangeField = createHandleChangeField(setModel, setErrors);
  const validateField = createValidateField(setErrors);
  const showMensagem = createShowMensagem(errors);

  /**
   * useEffect - Carregamento DUPLO de Dados
   *
   * Por que dois carregamentos?
   * - Precisa de dados do funcionário (idUsuario, nomeLogin, etc)
   * - Precisa de lista de funções para dropdown codigoFuncao
   * - Ambos são necessários para renderizar o formulário
   * - Se um falhar, mostra erro e volta para lista
   *
   * Sequência:
   * 1. Valida idUsuario na URL
   * 2. Faz Promise.all para carregar em paralelo (mais rápido)
   * 3. Se sucesso: setModel + setFuncoes
   * 4. Se erro: mostra alerta e volta para lista
   * 5. Sempre: setLoading(false) para renderizar formulário
   */
  useEffect(() => {
    const loadData = async () => {
      // VALIDAÇÃO CRÍTICA: Sem idUsuario, não há funcionário para editar
      if (!idUsuario) {
        alert("ID do funcionário não fornecido");
        setLoading(false);
        navigate(ROTA.FUNCIONARIO.LISTAR); // Volta para lista se erro
        return;
      }

      try {
        // Carrega em paralelo para ser mais rápido
        const response = await apiGetFuncionario(Number(idUsuario));
        if (response.data.dados) {
          // Não carregar a senha hash no formulário de edição.
          // A senha deve ficar em branco até o usuário digitar uma nova.
          setModel({ ...response.data.dados, senha: '' });
        }

        // Carrega todas as funções disponíveis para dropdown
        const resFuncoes = await apiGetFuncoes(1, 100);
        const dadosFuncoes = resFuncoes?.data?.dados;
        const funcaoList = Array.isArray(dadosFuncoes)
          ? dadosFuncoes
          : Array.isArray(dadosFuncoes?.content)
          ? dadosFuncoes.content
          : [];
        setFuncoes(funcaoList);
      } catch (error: unknown) {
        console.log(error);
        alert("Erro ao carregar dados");
      } finally {
        // Sempre desativa spinner, quer sucesso ou erro
        setLoading(false);
      }
    };

    loadData();
  }, [idUsuario, navigate]); // Recarrega se idUsuario ou navigate mudar

  /**
   * onSubmitForm - Validação e Envio dos Dados
   *
   * Fluxo:
   * 1. Previne comportamento padrão do form (submit)
   * 2. Valida se idUsuario e model existem
   * 3. Prepara payload para enviar ao backend
   * 4. IMPORTANTE: Não envia idUsuario (é PK, vem na URL)
   * 5. Envia PUT: /3-funcionario/{idUsuario}
   * 6. Se sucesso: volta para lista com toast de sucesso
   * 7. Se erro: mostra alerta
   */
  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idUsuario || !model) {
      alert("Dados incompletos para atualização");
      return;
    }

    try {
      /**
       * IMPORTANTE - Construção do Payload para PUT
       *
       * Por que codigoFuncao é string e não number?
       * - codigoFuncao é FK para tabela FUNCAO
       * - No banco: CODIGO_FUNCAO NUMBER(4), mas é lookup code, não ID
       * - Trabalhamos como string para simplicidade
       * - Exemplos: "1001", "2050", "3100"
       *
       * Por que NÃO incluir idUsuario?
       * - idUsuario é PK (chave primária)
       * - PKs NUNCA são atualizadas no banco
       * - Banco rejeita com erro ORA-02429: cannot drop column referenced
       * - idUsuario vem na URL do PUT: /3-funcionario/{idUsuario}
       * - Backend usa idUsuario da URL para saber qual registro atualizar
       *
       * Campos enviados:
       * - nomeLogin: string, validado em zCamposAlterar (3-50 chars)
       * - senha: string, validado (6-50 chars)
       * - codigoFuncao: string (ex: "1001"), validado (required)
       * - dataContratacao: string (YYYY-MM-DD), validado (required)
       * - ativo: number (1 ou 0), sempre convertido com Number()
       */
      const funcionarioToSend: Partial<Funcionario> = {
        nomeLogin: model.nomeLogin,
        email: model.email,
        dataContratacao: model.dataContratacao,
        ativo: Number(model.ativo), // Convertido para number
      };

      if (model.senha && String(model.senha).trim().length > 0) {
        funcionarioToSend.senha = model.senha;
      }

      if (model.codigoFuncao != null) {
        funcionarioToSend.codigoFuncao = Number(model.codigoFuncao);
      }

      console.log(
        "[onSubmitForm] Dados a enviar:",
        JSON.stringify(funcionarioToSend, null, 2)
      );

      await apiPutFuncionario(
        Number(idUsuario),
        funcionarioToSend as unknown as Funcionario
      );

      navigate(ROTA.FUNCIONARIO.LISTAR, {
        state: {
          toast: {
            message: `Funcionário ID ${idUsuario} alterado com sucesso!`,
            type: "success",
          },
        },
      });
    } catch (error: unknown) {
      console.log(error);
      alert("Erro ao atualizar funcionário");
    }
  };

  const onCancel = () => {
    navigate(ROTA.FUNCIONARIO.LISTAR);
  };

  const getInputClass = () => {
    return "form-control app-label mt-2";
  };

  if (loading || !model) {
    return (
      <div className="padraoPagina">
        <div className="container py-8 text-center">
          <i className="fas fa-spinner fa-spin text-4xl"></i>
          <p className="mt-4">Carregando...</p>
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
          <span className="text-gray-600">Alterar</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-user-edit text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {FUNCIONARIO.TITULO.ATUALIZAR}
          </h1>
          <p className="text-xl">Edição de Funcionário</p>
        </div>
      </section>

      <main className="container py-8">
        <div
          className="card animated fadeInDown"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <form onSubmit={onSubmitForm}>
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
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.NOME_LOGIN,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(FUNCIONARIO.FIELDS.NOME_LOGIN, e)
                    }
                  />
                  {showMensagem(FUNCIONARIO.FIELDS.NOME_LOGIN)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={FUNCIONARIO.FIELDS.SENHA} className="appLabel">
                  {FUNCIONARIO.LABEL.SENHA}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={FUNCIONARIO.FIELDS.SENHA}
                    name={FUNCIONARIO.FIELDS.SENHA}
                    type="password"
                    value={model?.senha || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.SENHA,
                        e.target.value
                      )
                    }
                    onBlur={(e) => validateField(FUNCIONARIO.FIELDS.SENHA, e)}
                  />
                  {showMensagem(FUNCIONARIO.FIELDS.SENHA)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={FUNCIONARIO.FIELDS.EMAIL} className="appLabel">
                  {FUNCIONARIO.LABEL.EMAIL}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={FUNCIONARIO.FIELDS.EMAIL}
                    name={FUNCIONARIO.FIELDS.EMAIL}
                    type="email"
                    value={model?.email || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.EMAIL,
                        e.target.value
                      )
                    }
                    onBlur={(e) => validateField(FUNCIONARIO.FIELDS.EMAIL, e)}
                  />
                  {showMensagem(FUNCIONARIO.FIELDS.EMAIL)}
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
                  <select
                    id={FUNCIONARIO.FIELDS.CODIGO_FUNCAO}
                    name={FUNCIONARIO.FIELDS.CODIGO_FUNCAO}
                    value={model?.codigoFuncao ?? ""}
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.CODIGO_FUNCAO,
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    onBlur={(e) =>
                      validateField(FUNCIONARIO.FIELDS.CODIGO_FUNCAO, e)
                    }
                  >
                    <option value="">-- Selecione uma função --</option>
                    {funcoes.map((f) => (
                      <option key={f.codigoFuncao} value={f.codigoFuncao}>
                        {f.nomeFuncao} ({f.codigoFuncao})
                      </option>
                    ))}
                  </select>
                  {showMensagem(FUNCIONARIO.FIELDS.CODIGO_FUNCAO)}
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
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.DATA_CONTRATACAO,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(FUNCIONARIO.FIELDS.DATA_CONTRATACAO, e)
                    }
                  />
                  {showMensagem(FUNCIONARIO.FIELDS.DATA_CONTRATACAO)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={FUNCIONARIO.FIELDS.ATIVO} className="appLabel">
                  {FUNCIONARIO.LABEL.ATIVO}
                </label>
                <div className="form-field-wrapper">
                  <select
                    id={FUNCIONARIO.FIELDS.ATIVO}
                    name={FUNCIONARIO.FIELDS.ATIVO}
                    value={model?.ativo ?? 1}
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.ATIVO,
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value={1}>Ativo</option>
                    <option value={0}>Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                id="submit"
                type="submit"
                className="btn btn-sucess"
                title="Salvar alterações"
              >
                <span className="btn-icon">
                  <i>
                    <FaSave />
                  </i>
                </span>
                Salvar
              </button>

              <button
                id="cancel"
                type="button"
                onClick={onCancel}
                className="btn btn-cancel"
                title="Cancelar"
              >
                <span className="btn-icon">
                  <i>
                    <MdCancel />
                  </i>
                </span>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
