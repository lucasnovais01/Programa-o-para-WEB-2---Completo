import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { apiGetQuarto } from "../../services/5-quarto/api/api.quarto";
import { QUARTO } from "../../services/5-quarto/constants/quarto.constants";
import { ROTA } from "../../services/router/url";
import type { Quarto } from "../../type/5-quarto";

import "../../assets/css/7-form.css";

// ============================================================
// COMPONENTE: Consultar Quarto
// ============================================================
// Propósito: Exibir os dados de um quarto de forma formatada
// e organizada, seguindo o padrão de layout do Alterar.tsx
// ============================================================

export default function ConsultarQuarto() {
  // ============================================================
  // Estado e hooks
  // ============================================================
  const { idQuarto } = useParams<{ idQuarto: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Quarto | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // useEffect: Buscar dados do quarto na API
  // ============================================================
  useEffect(() => {
    async function getOne() {
      if (!idQuarto) {
        setLoading(false);
        return;
      }
      try {
        const id = Number(idQuarto);
        const response = await apiGetQuarto(id);
        const dados = response?.data?.dados ?? null;
        if (dados) setModel(dados);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getOne();
  }, [idQuarto]);

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

    return String(value);
  };

  // ============================================================
  // Render
  // ============================================================

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

  if (!model) {
    return (
      <div className="padraoPagina">
        <div className="container py-8 text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p className="text-lg">Quarto não encontrado</p>
          <button
            onClick={() => navigate(ROTA.QUARTO.LISTAR)}
            className="btn btn-primary mt-4"
          >
            Voltar para Listagem
          </button>
        </div>
      </div>
    );
  }

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
            to={ROTA.QUARTO.LISTAR}
            className="text-blue-600 hover:text-blue-700"
          >
            Quartos
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Consultar</span>
        </div>
      </nav>

      {/* Banner */}
      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-search text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {QUARTO.TITULO.CONSULTAR}
          </h1>
          <p className="text-xl">Visualização do quarto</p>
        </div>
      </section>

      {/* Content */}
      <main className="container py-8">
        <div
          className="card animated fadeInDown"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <div className="form-grid">
            {/* Campo: ID Quarto (somente leitura) */}
            <div className="form-group">
              <label className="appLabel">ID</label>
              <div className="form-field-wrapper">
                {formatValue("idQuarto", model.idQuarto)}
              </div>
            </div>

            {/* Campo: Tipo de Quarto */}
            <div className="form-group">
              <label className="appLabel">
                {QUARTO.LABEL.CODIGO_TIPO_QUARTO}
              </label>
              <div className="form-field-wrapper">
                {formatValue("codigoTipoQuarto", model.codigoTipoQuarto)}
              </div>
            </div>

            {/* Campo: Número */}
            <div className="form-group">
              <label className="appLabel">{QUARTO.LABEL.NUMERO}</label>
              <div className="form-field-wrapper">
                {formatValue("numero", model.numero)}
              </div>
            </div>

            {/* Campo: Status */}
            <div className="form-group">
              <label className="appLabel">{QUARTO.LABEL.STATUS}</label>
              <div className="form-field-wrapper">
                {formatValue("statusQuarto", model.statusQuarto)}
              </div>
            </div>

            {/* Campo: Andar */}
            <div className="form-group">
              <label className="appLabel">{QUARTO.LABEL.ANDAR}</label>
              <div className="form-field-wrapper">
                {formatValue("andar", model.andar)}
              </div>
            </div>
          </div>

          {/* Botão de Voltar */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(ROTA.QUARTO.LISTAR)}
            >
              <span className="btn-icon">
                <i>
                  <MdArrowBack />
                </i>
              </span>
              Voltar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
