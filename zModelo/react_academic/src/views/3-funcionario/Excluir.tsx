/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MdCancel, MdDelete } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import "../../assets/css/7-form.css";
import {
  apiGetFuncionario,
  apiRemoveLoginFuncionario,
} from "../../services/3-funcionario/api/api.funcionario";
import { FUNCIONARIO } from "../../services/3-funcionario/constants/funcionario.constants";
import type { Funcionario } from "../../services/3-funcionario/type/funcionario";
import { ROTA } from "../../services/router/url";

/**
 * ========================================================================
 * COMPONENTE: ExcluirFuncionario
 * ========================================================================
 * Propósito: TRANSFORMAR funcionário em hóspede (não deletar!)
 *
 * COMPORTAMENTO ESPECIAL (DIFERENTE DE OUTRAS ENTIDADES):
 *
 * O que acontece quando clica em "Remover Função"?
 * NÃO deleta o registro inteiramente (perderia dados da pessoa)
 * SIM: Define codigoFuncao = null
 * SIM: Transforma de volta em HOSPEDE puro (TIPO=0)
 * SIM: Mantém dados: nome, CPF, RG, sexo, etc
 *
 * Por quê?
 * - Funcionário é especialização de HOSPEDE
 * - Um funcionário pode deixar de ser funcionário mas continua hóspede
 * - Exemplo: "Gerente saiu da empresa" → volta a ser hóspede normal
 * - Ninguém perde seus dados de cadastro
 *
 * Técnica de Implementação:
 * - O backend trata a remoção como exclusão do registro de funcionário
 * - Backend recebe DELETE /3-funcionario/{idUsuario}
 * - O registro COCAO_FUNCIONARIO é removido
 * - COCAO_HOSPEDE é atualizado para tipo = 0
 *
 * Fluxo:
 * 1. Usuário vê dados do funcionário
 * 2. Clica em "Remover Função"
 * 3. Confirma em dialog: "Transformar em hóspede?"
 * 4. Envia DELETE para /3-funcionario/{idUsuario}
 * 5. Volta para lista com mensagem de sucesso
 * ========================================================================
 */

export default function ExcluirFuncionario() {
  // CRÍTICO: Extrair :idUsuario da URL (não :id)
  // Correspondência com router.tsx: `${ROTA.FUNCIONARIO.EXCLUIR}/:idUsuario`
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false); // Flag para evitar clicks duplos
  const [error, setError] = useState<string | null>(null);

  const getInputClass = () => {
    return "form-control app-label mt-2";
  };

  /**
   * useEffect - Carregamento de Dados
   *
   * Precisa carregar os dados do funcionário porque:
   * - Exibe na tela quem está sendo removido
   * - Precisa dos dados atuais para enviar PUT
   * - Mostra nomeLogin, dataContratacao, etc
   */
  useEffect(() => {
    async function getFuncionario() {
      // VALIDAÇÃO CRÍTICA: Sem idUsuario, não há funcionário para remover
      if (!idUsuario) {
        setError("ID do funcionário não fornecido");
        setLoading(false);
        return;
      }

      try {
        const response = await apiGetFuncionario(Number(idUsuario));
        if (response.data.dados) {
          setModel(response.data.dados); // Armazena dados atuais
        } else {
          setError("Funcionário não encontrado");
        }
      } catch (err: any) {
        console.error(err);
        setError("Erro ao carregar funcionário");
      } finally {
        // Desativa spinner em qualquer caso
        setLoading(false);
      }
    }

    getFuncionario();
  }, [idUsuario]);

  /**
   * onDelete - Transformação em Hóspede
   *
   * IMPORTANTE: Não deleta, apenas remove a função!
   *
   * Processo:
   * 1. Confirma com usuário (dialog)
   * 2. Envia DELETE para endpoint /funcionario/excluir/{idUsuario}
   * 3. Backend interpreta DELETE como "remover função"
   * 4. Banco atualiza COCAO_FUNCIONARIO setando codigoFuncao = null
   * 5. TIPO muda de 1 (funcionário) para 0 (hóspede)
   * 6. Dados pessoais são mantidos em COCAO_HOSPEDE
   * 7. Volta para lista com toast de sucesso
   *
   * Por que usar DELETE mas não deletar?
   * - O backend implementa DELETE como "remover função"
   * - Em vez de deletar o registro inteiro
   * - Apenas remove codigoFuncao, mantendo pessoa no sistema
   * - Pessoa volta a ser hóspede puro (TIPO=0)
   */
  const onDelete = async () => {
    // VALIDAÇÃO CRÍTICA: Precisa ter modelo carregado
    if (!idUsuario || !model) {
      alert("Dados incompletos para remover função");
      return;
    }

    // Confirmação do usuário com mensagem clara
    if (
      !confirm(
        `Tem certeza que deseja remover a função do funcionário?\n\n` +
          `${model.nomeLogin} (ID: ${idUsuario})\n\n` +
          `Ele será transformado em hóspede e poderá voltar a usar o sistema.`
      )
    ) {
      return; // Usuário cancelou
    }

    // Ativa flag para desabilitar botão durante requisição
    setDeleting(true);

    try {
      // Usa DELETE para remover a função (transforma em hóspede)
      // Backend interpreta DELETE como "remove função" e mantém dados pessoais
      console.log("[onDelete] Removendo função do funcionário ID:", idUsuario);

      // DELETE: Remove a função, transformando funcionário em hóspede
      // Mantém os dados pessoais intactos
      await apiRemoveLoginFuncionario(Number(idUsuario));

      // Sucesso! Volta para lista com mensagem positiva
      navigate(ROTA.FUNCIONARIO.LISTAR, {
        state: {
          toast: {
            message: `${model.nomeLogin} foi transformado em hóspede com sucesso!`,
            type: "success",
          },
        },
      });
    } catch (error: any) {
      console.log("[onDelete] Erro:", error);
      alert("Erro ao remover função do funcionário. Tente novamente.");
    } finally {
      // Sempre desativa flag, quer sucesso ou erro
      setDeleting(false);
    }
  };

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
          <span className="text-gray-600">Excluir</span>
        </div>
      </nav>

      <section className="devtools-banner bg-blue-600 text-white">
        <div className="container text-center">
          <i className="fas fa-user-slash text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {FUNCIONARIO.TITULO.EXCLUIR}
          </h1>
          <p className="text-xl">Remover função de funcionário</p>
        </div>
      </section>

      <main className="container py-8">
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            ℹ️ Informação
          </h3>
          <p className="text-blue-700">
            O funcionário será transformado em hóspede. Seus dados pessoais
            serão mantidos no sistema.
          </p>
        </div>

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
          </div>

          <div className="form-actions">
            <button
              id="delete"
              type="button"
              disabled={deleting}
              onClick={onDelete}
              className="btn btn-delete"
              title="Excluir funcionário"
            >
              <span className="btn-icon">
                <i>
                  <MdDelete />
                </i>
              </span>
              Excluir
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
        </div>
      </main>
    </div>
  );
}
