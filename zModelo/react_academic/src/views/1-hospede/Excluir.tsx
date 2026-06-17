import { useEffect, useState } from "react";
import { MdCancel, MdDelete } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  apiDeleteHospede,
  apiGetHospede,
} from "../../services/1-hospede/api/api.hospede";
import { HOSPEDE } from "../../services/1-hospede/constants/hospede.constants";
import { ROTA } from "../../services/router/url";
import type { Hospede } from "../../type/1-hospede";

import "../../assets/css/7-form.css";

// ============================================================
// COMPONENTE: Excluir Hóspede
// ============================================================
// Propósito: Exibir dados do hóspede e confirmar exclusão
// Segue o mesmo padrão do Consultar.tsx
// ============================================================

export default function ExcluirHospede() {
  // ============================================================
  // Estado e hooks
  // ============================================================
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Hospede | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // ============================================================
  // useEffect: Buscar dados do hóspede na API
  // ============================================================
  useEffect(() => {
    async function getOne() {
      if (!idUsuario) {
        setLoading(false);
        return;
      }
      try {
        const id = parseInt(idUsuario, 10);
        const response = await apiGetHospede(id);
        const dados = response?.data?.dados ?? null;
        if (dados) setModel(dados);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getOne();
  }, [idUsuario]);

  // ============================================================
  // Helper: Formata valor para exibição
  // ============================================================
  const formatValue = (key: string, value: any): string => {
    if (!value && value !== 0 && value !== false) return "-";
    if (value === true) return "Sim";
    if (value === false) return "Não";

    const k = key.toLowerCase();
    if (k.includes("data")) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
    }
    if (k === "tipo")
      return value === 0 ? "Hóspede" : value === 1 ? "Funcionário" : "Outro";
    if (k === "sexo") {
      const sexoMap: { [key: string]: string } = {
        M: "Masculino",
        F: "Feminino",
        O: "Outro",
      };
      return sexoMap[value] || value;
    }

    return String(value);
  };

  // ============================================================
  // Handler: Excluir hóspede
  // ============================================================
  const onDelete = async () => {
    if (!idUsuario) {
      alert("ID inválido");
      return;
    }

    // Confirmação antes de excluir
    if (
      !confirm(
        `⚠️ ATENÇÃO! Tem certeza que deseja EXCLUIR o hóspede ID: ${idUsuario}? Esta ação é irreversível!`
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const id = parseInt(idUsuario, 10);
      console.log("[Excluir.tsx] Tentando excluir hóspede ID:", id);
      const response = await apiDeleteHospede(id);
      console.log("[Excluir.tsx] Resposta do delete:", response);

      // Navega com toast de sucesso
      navigate(ROTA.HOSPEDE.LISTAR, {
        state: {
          toast: {
            message: `Hóspede #${id} excluído com sucesso!`,
            type: "success",
          },
        },
      });
    } catch (error: any) {
      setDeleting(false);
      console.error("[Excluir.tsx] Erro ao excluir:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      alert(
        HOSPEDE.OPERACAO.EXCLUIR.ERRO +
          (error?.response?.data?.mensagem
            ? "\n" + error.response.data.mensagem
            : "")
      );
    }
  };

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="padraoPagina">
      {/* Breadcrumb */}
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
            to={ROTA.HOSPEDE.LISTAR}
            className="text-blue-600 hover:text-blue-700"
          >
            Hóspedes
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Excluir</span>
        </div>
      </nav>

      {/* Banner */}
      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-trash-alt text-6xl mb-4 text-red-600"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Excluir Hóspede
          </h1>
          <p className="text-xl text-red-600 font-semibold">
            ⚠️ Esta ação é irreversível
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container py-8">
        <div
          className="card animated fadeInDown"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <h2 className="text-red-600">{HOSPEDE.TITULO.EXCLUIR}</h2>
          <br />

          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          ) : model ? (
            <>
              {/* Aviso de exclusão */}
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded">
                <p className="text-red-800 font-semibold flex items-center justify-center gap-2">
                  Tem certeza que deseja excluir o hóspede abaixo?
                  <br></br><br></br>
                </p>
              </div>

              {/* Dados do hóspede */}
              <form>
                <div className="form-grid">
                  {/* Campo: Nome */}
                  <div className="form-group">
                    <label className="appLabel">{HOSPEDE.LABEL.NOME}</label>
                    <div className="form-field-wrapper">
                      <input
                        type="text"
                        value={model.nomeHospede || "-"}
                        className="form-control app-label mt-2"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Campo: CPF */}
                  <div className="form-group">
                    <label className="appLabel">{HOSPEDE.LABEL.CPF}</label>
                    <div className="form-field-wrapper">
                      <input
                        type="text"
                        value={model.cpf || "-"}
                        className="form-control app-label mt-2"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Campo: RG */}
                  <div className="form-group">
                    <label className="appLabel">{HOSPEDE.LABEL.RG}</label>
                    <div className="form-field-wrapper">
                      <input
                        type="text"
                        value={model.rg || "-"}
                        className="form-control app-label mt-2"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Campo: Sexo */}
                  <div className="form-group">
                    <label className="appLabel">{HOSPEDE.LABEL.SEXO}</label>
                    <div className="form-field-wrapper">
                      <input
                        type="text"
                        value={formatValue("sexo", model.sexo)}
                        className="form-control app-label mt-2"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Campo: Data de Nascimento */}
                  <div className="form-group">
                    <label className="appLabel">
                      {HOSPEDE.LABEL.DATA_NASCIMENTO}
                    </label>
                    <div className="form-field-wrapper">
                      <input
                        type="text"
                        value={formatValue(
                          "dataNascimento",
                          model.dataNascimento
                        )}
                        className="form-control app-label mt-2"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Campo: E-mail */}
                  <div className="form-group">
                    <label className="appLabel">{HOSPEDE.LABEL.EMAIL}</label>
                    <div className="form-field-wrapper">
                      <input
                        type="text"
                        value={model.email || "-"}
                        className="form-control app-label mt-2"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Campo: Telefone */}
                  <div className="form-group">
                    <label className="appLabel">{HOSPEDE.LABEL.TELEFONE}</label>
                    <div className="form-field-wrapper">
                      <input
                        type="text"
                        value={model.telefone || "-"}
                        className="form-control app-label mt-2"
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-delete"
                    onClick={onDelete}
                    disabled={deleting}
                  >
                    <span className="btn-icon">
                      <i>
                        <MdDelete />
                      </i>
                    </span>
                    {deleting ? "Excluindo..." : "Excluir"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => navigate(ROTA.HOSPEDE.LISTAR)}
                    disabled={deleting}
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
            </>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-exclamation-circle text-2xl text-red-600 mb-2"></i>
              <p className="text-gray-600">Hóspede não encontrado.</p>
              <button
                onClick={() => navigate(ROTA.HOSPEDE.LISTAR)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Voltar para a listagem
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
