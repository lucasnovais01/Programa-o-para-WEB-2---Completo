/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import "../../assets/css/7-form.css";
import { apiGetFuncao } from "../../services/2-funcao/api/api.funcao";
import { FUNCAO } from "../../services/2-funcao/constants/funcao.constants";
import { ROTA } from "../../services/router/url";
import type { Funcao } from "../../type/2-funcao";

export default function ConsultarFuncao() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Funcao | null>(null);
  const [loading, setLoading] = useState(true);
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
          <span className="text-gray-600">Consultar</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-search text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Consultar Função
          </h1>
          <p className="text-xl">Visualize os detalhes da função</p>
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

            <div className="form-group">
              <label className="appLabel">{FUNCAO.LABEL.NIVEL_ACESSO}</label>
              <div className="form-field-wrapper">
                <select
                  value={model.nivelAcesso || 1}
                  className="form-control app-label mt-2"
                  disabled
                >
                  <option value={1}>1 - Básico</option>
                  <option value={2}>2 - Intermediário</option>
                  <option value={3}>3 - Avançado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <NavLink to={ROTA.FUNCAO.LISTAR} className="btn btn-cancel">
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
