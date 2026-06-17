/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import type { Hospede } from "../../type/1-hospede";

import "../../assets/css/7-form.css";
import PaginationFooter from "../../components/pagination/PaginationFooter";
import { apiGetHospedes } from "../../services/1-hospede/api/api.hospede";
import { HOSPEDE } from "../../services/1-hospede/constants/hospede.constants";
import { ROTA } from "../../services/router/url";

// ============================================================
// 1 - Estrutura
// ============================================================

export default function ListarHospede() {
  // --- Estado local ---------------------------------------------------
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
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

  // --- Colunas (para facilitar manutenção e leitura) ------------------
  const columns = [
    "idUsuario",
    "nomeHospede",
    "cpf",
    "rg",
    "sexo",
    "dataNascimento",
    "email",
    "telefone",
    "tipo",
    "ativo",
  ];

  // ============================================================
  // 2 - Carregamento de dados (API)
  //    - Usamos o helper `apiGetHospedes` (padrão do modelo)
  //    - Desembrulhamos `res.data.dados` como no backend do curso
  // ============================================================
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiGetHospedes(
          currentPage,
          pageSize,
          'idUsuario',
          'ASC',
          searchTerm,
        );
        const dados = res?.data?.dados;
        setHospedes(dados?.content ?? []);
        setTotalPages(dados?.totalPages ?? 1);
        setTotalElements(dados?.totalElements ?? 0);
      } catch (err) {
        console.error("Erro ao buscar hóspedes:", err);
        showToast("Erro ao carregar hóspedes", "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [currentPage, pageSize, searchTerm]);

  // Se a rota foi chamada com state.toast (por exemplo, vindo de Criar.tsx),
  // exibimos o toast recebido e limpamos o state para não repetir a mensagem.
  useEffect(() => {
    const anyState: any = location.state;
    if (anyState && anyState.toast) {
      const t = anyState.toast as {
        message: string;
        type: "success" | "error";
      };
      showToast(t.message, t.type);
      // Limpa o state da rota para evitar reexibir ao recarregar
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // ============================================================
  // 3 - Filtragem / busca simples
  //    - Busca global em todas as propriedades do objeto
  // ============================================================
  const filteredData = hospedes;

  // ============================================================
  // 4 - Toast / feedback - TEMPO DE EXIBIÇÃO
  // ============================================================
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // 5 segundos
  };

  // ============================================================
  // 5 - Ações (navegação e placeholders para criar/editar/excluir)
  //    - Mantemos a navegação via `ROTA` como no modelo
  // ============================================================
  const handleCreate = () => {
    navigate(ROTA.HOSPEDE.CRIAR);
    showToast("Redirecionando para criação...", "success");
  };

  const handleEdit = (id?: number) => {
    if (id == null) return showToast("ID inválido", "error");
    navigate(`${ROTA.HOSPEDE.ATUALIZAR}/${id}`);
    // Toast será exibido ao retornar do Alterar.tsx via state
  };

  const handleDelete = (id?: number) => {
    if (id == null) return showToast("ID inválido", "error"); // Em vez de deletar diretamente aqui, abrimos a página de confirmação

    /*
    if (confirm(`Tem certeza que deseja excluir o hóspede ID: ${id}?`)) {
      showToast(`Hóspede ID ${id} excluído com sucesso!`, "success");
    }
*/

    // `Excluir.tsx` que já implementa a chamada ao backend e o fluxo.
    // Isso evita duplicar lógica e mantém a confirmação/erro centralizados.
    navigate(`${ROTA.HOSPEDE.EXCLUIR}/${id}`);
  };

  const handleConsult = (id?: number) => {
    if (id == null) return showToast("ID inválido", "error");
    navigate(`${ROTA.HOSPEDE.POR_ID}/${id}`);
    showToast(`Consultando hóspede ID: ${id}`, "success");
  };

  // ============================================================
  // 6 - Helpers de formatação (datas, booleanos, enums)
  // ============================================================
  const formatValue = (key: string, value: any): string | ReactNode => {
    if (value === true) return "Sim";
    if (value === false) return "Não";
    const k = key.toLowerCase();
    if (k.includes("data")) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
    }
    if (k === "tipo")
      return value === 0 ? "Hóspede" : value === 1 ? "Funcionário" : "Outro";
    return value?.toString() || "-";
  };

  // ============================================================
  // 7 - Render
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
          <span className="text-gray-600">Hóspedes</span>
        </div>
      </nav>

      {/* Banner */}
      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-users text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Gerenciamento de Hóspedes
          </h1>
          <p className="text-xl">
            Lista completa de todos os hóspedes cadastrados
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container py-8">
        {/* Toast */}
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

        {/* Tabela */}
        <div className="devtools-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {HOSPEDE.TITULO.LISTA}
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchTerm(e.target.value);
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

          <div className="table-container">
            <table className="dev-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
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
                      Nenhum hóspede encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((h) => (
                    <tr key={h.idUsuario ?? Math.random()}>
                      {columns.map((col) => (
                        <td key={col}>{formatValue(col, (h as any)[col])}</td>
                      ))}
                      <td className="actions">
                        <button
                          onClick={() => handleConsult(h.idUsuario)}
                          className="btn-show"
                          title="Consultar"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleEdit(h.idUsuario)}
                          className="btn-edit"
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(h.idUsuario)}
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
