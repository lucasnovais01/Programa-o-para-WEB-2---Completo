/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import "../../assets/css/7-form.css";
import PaginationFooter from "../../components/pagination/PaginationFooter";
import { apiGetTiposQuarto } from "../../services/4-tipo-quarto/api/api.tipo-quarto";
import { TIPO_QUARTO } from "../../services/4-tipo-quarto/constants/tipo-quarto.constants";
import { ROTA } from "../../services/router/url";
import type { TipoQuarto } from "../../type/4-tipo-quarto";

export default function ListarTipoQuarto() {
  const [tipos, setTipos] = useState<TipoQuarto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const columns = [
    "codigoTipoQuarto",
    "nomeTipo",
    "capacidadeMaxima",
    "valorDiaria",
  ];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiGetTiposQuarto(currentPage, pageSize);
        const dados = res?.data?.dados;
        const tipoList = extractListFromResponse(dados);
        const pageInfo = Array.isArray(dados) ? null : dados;

        setTipos(tipoList);
        setTotalPages(pageInfo?.totalPages ?? 1);
        setTotalElements(pageInfo?.totalElements ?? tipoList.length);
      } catch (err) {
        console.error("Erro ao buscar tipos de quarto:", err);
        showToast("Erro ao carregar tipos de quarto", "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const anyState: any = location.state;
    if (anyState && anyState.toast) {
      const t = anyState.toast as {
        message: string;
        type: "success" | "error";
      };
      showToast(t.message, t.type);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const extractListFromResponse = (dados: any): TipoQuarto[] => {
    if (Array.isArray(dados)) return dados;
    if (dados && Array.isArray(dados.content)) return dados.content;
    return [];
  };

  const filteredData = tipos.filter((f) =>
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
    navigate(ROTA.TIPO_QUARTO.CRIAR);
  };

  const handleEdit = (codigo?: string | number) => {
    if (codigo == null) return showToast("Código inválido", "error");
    navigate(`${ROTA.TIPO_QUARTO.ATUALIZAR}/${codigo}`);
  };

  const handleDelete = (codigo?: string | number) => {
    if (codigo == null) return showToast("Código inválido", "error");
    navigate(`${ROTA.TIPO_QUARTO.EXCLUIR}/${codigo}`);
  };

  const handleConsult = (codigo?: string | number) => {
    if (codigo == null) return showToast("Código inválido", "error");
    navigate(`${ROTA.TIPO_QUARTO.POR_ID}/${codigo}`);
  };

  const formatValue = (key: string, value: any): string | ReactNode => {
    if (value === true) return "Sim";
    if (value === false) return "Não";
    const k = key.toLowerCase();
    if (k.includes("data")) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
    }
    if (k.includes("valor")) {
      const n = Number(value);
      if (isNaN(n)) return "-";
      return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
    return value?.toString() || "-";
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
          <span className="text-gray-600">Tipos de Quarto</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-bed text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {TIPO_QUARTO.TITULO.LISTA}
          </h1>
          <p className="text-xl">Gerenciamento dos tipos de quarto</p>
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
              {TIPO_QUARTO.TITULO.LISTA}
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                <i className="fas fa-plus mr-1"></i>Novo
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="dev-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>
                      {col === "codigoTipoQuarto"
                        ? "Código"
                        : col === "nomeTipo"
                        ? "Nome"
                        : col === "capacidadeMaxima"
                        ? "Capacidade"
                        : "Valor Diária"}
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
                      Nenhum tipo de quarto encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((f) => (
                    <tr key={f.codigoTipoQuarto ?? Math.random()}>
                      {columns.map((col) => (
                        <td key={col}>{formatValue(col, (f as any)[col])}</td>
                      ))}
                      <td className="actions">
                        <button
                          onClick={() => handleConsult(f.codigoTipoQuarto)}
                          className="btn-show"
                          title="Consultar"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleEdit(f.codigoTipoQuarto)}
                          className="btn-edit"
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(f.codigoTipoQuarto)}
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
        </div>

        <div className="mt-4">
          <PaginationFooter
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={(page) => setCurrentPage(page)}
          />
          {loading && (
            <div className="text-center text-gray-600 mt-3">Carregando...</div>
          )}
        </div>
      </main>
    </div>
  );
}
