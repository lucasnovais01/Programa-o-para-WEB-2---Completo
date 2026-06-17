import { useEffect, useState } from "react";
import { MdCancel, MdDelete } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import "../../assets/css/7-form.css";
import {
  apiDeleteTipoQuarto,
  apiGetTipoQuarto,
} from "../../services/4-tipo-quarto/api/api.tipo-quarto";
import { TIPO_QUARTO } from "../../services/4-tipo-quarto/constants/tipo-quarto.constants";
import { ROTA } from "../../services/router/url";
import type { TipoQuarto } from "../../type/4-tipo-quarto";

export default function ExcluirTipoQuarto() {
  const { codigoTipoQuarto } = useParams<{ codigoTipoQuarto: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<TipoQuarto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
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

  const onDelete = async () => {
    if (
      !codigoTipoQuarto ||
      !confirm("Tem certeza que deseja excluir este tipo de quarto?")
    )
      return;

    setDeleting(true);
    try {
      await apiDeleteTipoQuarto(Number(codigoTipoQuarto));

      navigate(ROTA.TIPO_QUARTO.LISTAR, {
        state: {
          toast: {
            message: "Tipo de quarto excluído com sucesso!",
            type: "success",
          },
        },
      });
    } catch (err: any) {
      console.error(err);
      alert("Erro ao excluir tipo de quarto");
    } finally {
      setDeleting(false);
    }
  };

  const onCancel = () => {
    navigate(ROTA.TIPO_QUARTO.LISTAR);
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
          <span className="text-gray-600">Excluir</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-trash-alt text-6xl mb-4 text-red-600"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Excluir Tipo de Quarto
          </h1>
          <p className="text-xl">⚠️ Esta ação é irreversível</p>
        </div>
      </section>

      <main className="container py-8">
        <div
          className="card animated fadeInDown"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded">
            <p className="text-red-800 text-center font-semibold">
              Tem certeza que deseja excluir este tipo de quarto? Esta ação é
              irreversível.
            </p>
          </div>

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
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-delete"
              onClick={onDelete}
              disabled={deleting}
              title="Confirmar exclusão"
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
              onClick={onCancel}
              disabled={deleting}
              title="Cancelar exclusão"
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
