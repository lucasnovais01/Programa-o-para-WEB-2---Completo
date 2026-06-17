import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import "../../assets/css/7-form.css";
import { apiGetFuncoes } from "../../services/2-funcao/api/api.funcao";
import { FUNCAO } from "../../services/2-funcao/constants/funcao.constants";
import { ROTA } from "../../services/router/url";
import type { Funcao } from "../../type/2-funcao";

type PaginatedFuncaoData = {
  content: Funcao[];
  totalElements?: number;
  totalPages?: number;
};

export default function ListarFuncao() {
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPagingInfo, setShowPagingInfo] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const columns: Array<keyof Funcao> = [
    "codigoFuncao",
    "nomeFuncao",
    "descricao",
    "nivelAcesso",
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await apiGetFuncoes(currentPage, pageSize);
        const dados = res?.data?.dados;

        if (dados && !Array.isArray(dados) && Array.isArray(dados.content)) {
          const pageData = dados as PaginatedFuncaoData;
          setFuncoes(pageData.content ?? []);
          setTotalElements(pageData.totalElements ?? 0);
          setTotalPages(pageData.totalPages ?? 1);
          setShowPagingInfo(true);
        } else if (Array.isArray(dados)) {
          setFuncoes(dados);
          setTotalElements(dados.length);
          setTotalPages(1);
          setShowPagingInfo(false);
        } else {
          setFuncoes([]);
          setTotalElements(0);
          setTotalPages(1);
          setShowPagingInfo(false);
        }
      } catch (err) {
        console.error("Erro ao buscar funções:", err);
        showToast("Erro ao carregar funções", "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const state = location.state as
      | { toast?: { message: string; type: "success" | "error" } }
      | null;

    if (state?.toast) {
      showToast(state.toast.message, state.toast.type);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const filteredData = funcoes.filter((f) =>
    Object.values(f).some((v) =>
      v?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCreate = () => {
    navigate(ROTA.FUNCAO.CRIAR);
  };

  const handleEdit = (codigo?: string | number) => {
    if (codigo == null) return showToast("Código inválido", "error");
    navigate(`${ROTA.FUNCAO.ATUALIZAR}/${codigo}`);
  };

  const handleDelete = (codigo?: string | number) => {
    if (codigo == null) return showToast("Código inválido", "error");
    navigate(`${ROTA.FUNCAO.EXCLUIR}/${codigo}`);
  };

  const handleConsult = (codigo?: string | number) => {
    if (codigo == null) return showToast("Código inválido", "error");
    navigate(`${ROTA.FUNCAO.POR_ID}/${codigo}`);
  };

  const formatValue = (
    key: keyof Funcao,
    value: unknown,
  ): string | ReactNode => {
    if (value === true) return "Sim";
    if (value === false) return "Não";
    const k = key.toString().toLowerCase();
    if (k.includes("data")) {
      const d = new Date(value as string | number);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
    }
    if (k === "nivelacesso") {
      switch (value) {
        case 1:
          return "1 - Básico";
        case 2:
          return "2 - Intermediário";
        case 3:
          return "3 - Avançado";
        default:
          return value == null ? "-" : String(value);
      }
    }
    return value == null ? "-" : String(value);
  };

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
          <span className="text-gray-600">Funções</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-briefcase text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {FUNCAO.TITULO.LISTA}
          </h1>
          <p className="text-xl">Gerenciamento de funções do sistema</p>
        </div>
      </section>

      <main className="container py-8">
        {toast && (
          <div className="fixed top-20 right-4 z-50">
            <div className={`toast ${toast.type === "error" ? "error" : ""}`}>
              <div className="flex items-center">
                <i
                  className={`fas ${
                    toast.type === "success"
                      ? "fa-check"
                      : "fa-exclamation-triangle"
                  } mr-2`}
                ></i>
                <span>{toast.message}</span>
              </div>
            </div>
          </div>
        )}

        <div className="devtools-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {FUNCAO.TITULO.LISTA}
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                <i className="fas fa-plus mr-1"></i>Novo
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Carregando funções...
            </div>
          ) : (
            <div className="table-container">
              <table className="dev-table">
                <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>
                      {col === "codigoFuncao"
                        ? "Código"
                        : col === "nomeFuncao"
                        ? "Nome"
                        : col === "nivelAcesso"
                        ? "Nível"
                        : "Descrição"}
                    </th>
                  ))}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="text-center py-4 text-gray-500"
                    >
                      Nenhuma função encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((f, index) => (
                    <tr key={f.codigoFuncao ?? index}>
                      {columns.map((col) => (
                        <td key={col}>{formatValue(col, f[col])}</td>
                      ))}
                      <td className="actions">
                        <button
                          onClick={() => handleConsult(f.codigoFuncao)}
                          className="btn-show"
                          title="Consultar"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleEdit(f.codigoFuncao)}
                          className="btn-edit"
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(f.codigoFuncao)}
                          className="btn-delete"
                          title="Excluir"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}
          {showPagingInfo && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-4">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages} · {totalElements} registros
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
