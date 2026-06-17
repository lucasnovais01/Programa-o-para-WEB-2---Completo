import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import "../../assets/css/7-form.css";
import { apiGetTipoQuarto } from "../../services/4-tipo-quarto/api/api.tipo-quarto";
import { TIPO_QUARTO } from "../../services/4-tipo-quarto/constants/tipo-quarto.constants";
import { ROTA } from "../../services/router/url";
import type { TipoQuarto } from "../../type/4-tipo-quarto";

export default function ConsultarTipoQuarto() {
  const { codigoTipoQuarto } = useParams<{ codigoTipoQuarto: string }>();
  const [model, setModel] = useState<TipoQuarto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTipo() {
      try {
        setLoading(true);
        if (codigoTipoQuarto) {
          const response = await apiGetTipoQuarto(Number(codigoTipoQuarto));
          if (response.data.dados) setModel(response.data.dados);
        }
      } catch (err: any) {
        console.error(err);
        setError("Tipo de quarto não encontrado");
      } finally {
        setLoading(false);
      }
    }

    getTipo();
  }, [codigoTipoQuarto]);

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
          <div className="card max-w-2xl mx-auto text-center">
            <i className="fas fa-exclamation-circle text-4xl text-red-600 mb-4"></i>
            <p className="text-lg text-gray-600 mb-6">
              {error || "Tipo de quarto não encontrado"}
            </p>
            <NavLink
              to={ROTA.TIPO_QUARTO.LISTAR}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Voltar para a lista
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
            to={ROTA.TIPO_QUARTO.LISTAR}
            className="text-blue-600 hover:text-blue-700"
          >
            Tipos de Quarto
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Consultar</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-search text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Consultar Tipo de Quarto
          </h1>
          <p className="text-xl">Visualize os detalhes do tipo de quarto</p>
        </div>
      </section>

      <main className="container py-8">
        <div
          className="card animated fadeInDown"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <div className="form-grid">
            <div className="form-group">
              <label className="appLabel">Código</label>
              <div className="form-field-wrapper">
                <input
                  type="text"
                  value={model.codigoTipoQuarto || ""}
                  className="form-control app-label mt-2"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label className="appLabel">{TIPO_QUARTO.LABEL.NOME}</label>
              <div className="form-field-wrapper">
                <input
                  type="text"
                  value={model.nomeTipo || ""}
                  className="form-control app-label mt-2"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label className="appLabel">{TIPO_QUARTO.LABEL.CAPACIDADE}</label>
              <div className="form-field-wrapper">
                <input
                  type="text"
                  value={model.capacidadeMaxima ?? ""}
                  className="form-control app-label mt-2"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label className="appLabel">
                {TIPO_QUARTO.LABEL.VALOR_DIARIA}
              </label>
              <div className="form-field-wrapper">
                <input
                  type="text"
                  value={Number(model.valorDiaria).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  className="form-control app-label mt-2"
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <NavLink to={ROTA.TIPO_QUARTO.LISTAR} className="btn btn-cancel">
              <span className="btn-icon">
                <i className="fas fa-arrow-left"></i>
              </span>
              Voltar
            </NavLink>
          </div>
        </div>
      </main>
    </div>
  );
}
