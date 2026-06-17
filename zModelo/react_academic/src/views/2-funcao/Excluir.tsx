/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { MdCancel, MdDelete } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import "../../assets/css/7-form.css";
import {
  apiDeleteFuncao,
  apiGetFuncao,
} from "../../services/2-funcao/api/api.funcao";
import { FUNCAO } from "../../services/2-funcao/constants/funcao.constants";
import { ROTA } from "../../services/router/url";
import type { Funcao } from "../../type/2-funcao";

export default function ExcluirFuncao() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Funcao | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getFunc() {
      try {
        setLoading(true);
        if (id) {
          const response = await apiGetFuncao(Number(id));
          if (response.data.dados) {
            setModel(response.data.dados);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError("Função não encontrada");
      } finally {
        setLoading(false);
      }
    }

    getFunc();
  }, [id]);

  const onDelete = async () => {
    if (!id || !confirm("Tem certeza que deseja excluir esta função?")) return;

    setDeleting(true);
    try {
      await apiDeleteFuncao(Number(id));

      navigate(ROTA.FUNCAO.LISTAR, {
        state: {
          toast: {
            message: "Função excluída com sucesso!",
            type: "success",
          },
        },
      });
    } catch (err: any) {
      console.error(err);
      alert("Erro ao excluir função");
    } finally {
      setDeleting(false);
    }
  };

  const onCancel = () => {
    navigate(ROTA.FUNCAO.LISTAR);
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
              {error || "Função não encontrada"}
            </p>
            <NavLink
              to={ROTA.FUNCAO.LISTAR}
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
            to={ROTA.FUNCAO.LISTAR}
            className="text-blue-600 hover:text-blue-700"
          >
            Funções
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Excluir</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-trash-alt text-6xl mb-4 text-red-600"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Excluir Função
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
              Tem certeza que deseja excluir esta função? Esta ação é
              irreversível.
            </p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="appLabel">Código</label>
              <div className="form-field-wrapper">
                <input
                  type="text"
                  value={model.codigoFuncao || ""}
                  className="form-control app-label mt-2"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label className="appLabel">{FUNCAO.LABEL.NOME}</label>
              <div className="form-field-wrapper">
                <input
                  type="text"
                  value={model.nomeFuncao || ""}
                  className="form-control app-label mt-2"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label className="appLabel">{FUNCAO.LABEL.DESCRICAO}</label>
              <div className="form-field-wrapper">
                <textarea
                  value={model.descricao || ""}
                  className="form-control app-label mt-2"
                  rows={4}
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
