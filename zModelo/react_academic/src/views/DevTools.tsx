/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// Parte 1 - Importações e Dependências
// ============================================================
// 1. Importa hooks essenciais do React (`useState`, `useEffect`) para gerenciar estado e efeitos colaterais.
// 2. Importa `axios` para realizar requisições HTTP ao backend quando o mock estiver desativado.
// 3. Importa `ReactNode` para tipagem de elementos renderizáveis em funções de formatação.
// 4. Importa ferramentas de navegação do React Router (`useNavigate`, `NavLink`) para redirecionamentos e links.
// 5. Importa constantes de rotas (`ROTA`) para padronizar URLs de navegação no sistema.

import { useEffect, useState } from "react";

// import axios from "axios"; // não está mais usando axios diretamente, está usando o api.ts - 06-11-2025
import type { ReactNode } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { ROTA } from "../services/router/url";

import { http } from "../services/axios/config.axios";

// ============================================================
// Parte 2 - Configuração Inicial de Mock e Estrutura de Dados
// ============================================================
// 1. Define o objeto `mockApi` com dados simulados para todas as entidades do sistema.
// 2. Cada chave representa uma tabela/endpoint (ex: `usuarios`, `quartos`, `reservas`).
// 3. Os dados seguem o formato esperado pelo backend, permitindo prototipação sem conexão real.
// 4. Inclui comentários internos com exemplos desativados para expansão futura.
// 5. Serve como base para testes locais e demonstração da UI sem dependência de servidor.

// só descomentar para usar o mock

/*
const mockApi: { [key: string]: any[] } = {
  usuarios: [
    { ID_USUARIO: 1, 
      NOME_HOSPEDE: "João Silva Santos", 
      CPF: "12345678901", RG: "MG1234567", 
      SEXO: "M", DATA_NASCIMENTO: "1985-03-15", 
      EMAIL: "joao@email.com", 
      TELEFONE: "(11) 99999-1234", 
      TIPO: 1, 
      ATIVO: true },

    { ID_USUARIO: 2, 
      NOME_HOSPEDE: "Maria Oliveira", 
      CPF: "98765432109", 
      RG: "SP9876543", 
      SEXO: "F", 
      DATA_NASCIMENTO: "1990-07-22", 
      EMAIL: "maria@email.com", 
      TELEFONE: "(11) 88888-5678", 
      TIPO: 0, 
      ATIVO: true },
  ],



  funcoes: [
    { CODIGO_FUNCAO: 1, 
      NOME_FUNCAO: "Gerente Geral", 
      DESCRICAO: "Gestão geral", 
      NIVEL_ACESSO: 3 },
  ],
  tiposQuarto: [
    { CODIGO_TIPO_QUARTO: 1, 
      NOME_TIPO: "Standard", 
      CAPACIDADE_MAXIMA: 2, 
      VALOR_DIARIA: 250.00 },
  ],
  quartos: [
    { ID_QUARTO: 1, 
      NUMERO: "201", 
      CODIGO_TIPO_QUARTO: 1, 
      STATUS_QUARTO: "LIVRE", 
      ANDAR: "2º" },
  ],
  statusReserva: [
    { CODIGO_STATUS: 1, 
      DESCRICAO: "Confirmada" },
  ],
  reservas: [
    { ID_RESERVA: 1, 
      ID_USUARIO: 2, 
      ID_QUARTO: 1, 
      DATA_CHECK_IN: "2025-11-01", 
      DATA_CHECK_OUT: "2025-11-05", 
      NUMERO_HOSPEDES: 2, 
      VALOR_TOTAL: 1250.00, 
      NUMERO_DIARIAS: 5, 
      CODIGO_STATUS: 1 },
  ],
  servicos: [
    { CODIGO_SERVICO: 1, 
      NOME_SERVICO: "Café da Manhã", 
      PRECO: 25.00, 
      ATIVO: true },
  ],
  hospedeServico: [
    { ID_SOLICITACAO: 1, 
      ID_USUARIO: 2, 
      CODIGO_SERVICO: 1, 
      ID_RESERVA: 1, 
      DATA_SOLICITACAO: "2025-11-01", 
      QUANTIDADE: 2 },
  ],
};
*/

// ============================================================
// Parte 3 - Definição das Abas da Interface
// ============================================================
// 1. Array `tabs` define todas as abas visíveis no painel DevTools.
// 2. Cada aba tem `key` (correspondente ao nome no `mockApi` ou endpoint), `label` (texto exibido) e `columns` (campos a mostrar).
// 3. Permite controle total sobre quais dados são exibidos em cada aba.
// 4. Facilita a manutenção: adicionar nova aba exige apenas uma nova entrada no array.
// 5. Usado tanto com mock quanto com dados reais do backend.

const tabs = [
  {
    key: "usuarios",
    label: "Usuários (Todos)",
    columns: [
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
    ],
  },
  {
    key: "hospedes",
    label: "Hóspedes",
    columns: [
      "idUsuario",
      "nomeHospede",
      "cpf",
      "rg",
      "sexo",
      "dataNascimento",
      "email",
      "telefone",
      "ativo",
    ],
  },
  {
    key: "funcionarios",
    label: "Funcionários",
    columns: [
      "idUsuario",
      "nomeLogin",
      "codigoFuncao",
      "dataContratacao",
      "ativo",
    ],
  },
  {
    key: "funcoes",
    label: "Funções",
    columns: ["codigoFuncao", "nomeFuncao", "descricao", "nivelAcesso"],
  },

  {
    key: "tipos-quarto",
    label: "Tipos de Quarto",
    columns: [
      "codigoTipoQuarto",
      "nomeTipo",
      "capacidadeMaxima",
      "valorDiaria",
    ],
  },
  {
    key: "quartos",
    label: "Quartos",
    columns: [
      "idQuarto",
      "numero",
      "codigoTipoQuarto",
      "statusQuarto",
      "andar",
    ],
  },
  {
    key: "status-reserva",
    label: "Status Reserva",
    columns: ["CODIGO_STATUS", "DESCRICAO"],
  },
  {
    key: "reservas",
    label: "Reservas",
    columns: [
      "ID_RESERVA",
      "ID_USUARIO",
      "ID_QUARTO",
      "DATA_CHECK_IN",
      "DATA_CHECK_OUT",
      "NUMERO_HOSPEDES",
      "VALOR_TOTAL",
      "NUMERO_DIARIAS",
      "CODIGO_STATUS",
    ],
  },
  {
    key: "servicos",
    label: "Serviços",
    columns: ["CODIGO_SERVICO", "NOME_SERVICO", "PRECO", "ATIVO"],
  },
  {
    key: "hospede-servico",
    label: "Solicitações",
    columns: [
      "ID_SOLICITACAO",
      "ID_USUARIO",
      "CODIGO_SERVICO",
      "ID_RESERVA",
      "DATA_SOLICITACAO",
      "QUANTIDADE",
    ],
  },
];

// ============================================================
// Parte 4 - Início do Componente Principal e Estado Local
// ============================================================
// 1. Declaração do componente funcional `DevTools` com exportação padrão.
// 2. Inicializa estados com `useState`: aba ativa, termo de busca, toast de feedback e dados da API.
// 3. Usa `useNavigate` para redirecionamento programático (ex: edição de registro).
// 4. Define constante `USE_MOCK` como interruptor global entre dados reais e simulados.
// 5. Inicializa `apiData` com `mockApi` como fallback seguro quando não houver dados carregados.

export default function DevTools() {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [hateoasLinks, setHateoasLinks] = useState<Record<string, any> | null>(null);
  const [showHateoasLinks, setShowHateoasLinks] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPagingInfo, setShowPagingInfo] = useState(false);
  const [toast, setToast] = useState<
    | { message: string; type: "success" | "error" }
    | null
  >(null);
  const navigate = useNavigate();

  // Se colocar false, ativa chamadas reais ao backend, e se colocar true, usa dados mock em memória
  /*
  const USE_MOCK = true;

  // apiData contém dados mock (padrão) ou dados remotos carregados do backend
  const [apiData, setApiData] = useState<{ [key: string]: any[] }>(mockApi);
*/

  // apiData contém dados remotos carregados do backend
  const [apiData, setApiData] = useState<{ [key: string]: any[] }>({});

  // ============================================================
  // Parte 5 - Lógica de Preparação e Filtragem de Dados
  // ============================================================
  // 1. Busca a configuração da aba atual (`currentTab`) com base no `activeTab`.
  // 2. Para a aba "usuarios", mescla hóspedes e funcionários, deduplicando por `ID_USUARIO`.
  // 3. Aplica filtros específicos: hóspedes (`TIPO === 0`) e enriquecimento de funcionários com nome do hóspede.
  // 4. Implementa busca global em todos os campos do item atual.
  // 5. Garante que `filteredData` sempre contenha apenas os registros relevantes e buscados.

  const currentTab = tabs.find((t) => t.key === activeTab)!;
  let data: any[] = [];

  // Se a aba for 'usuarios', mesclar users/hospedes/funcionarios e deduplicar por ID_USUARIO
  if (activeTab === "usuarios") {
    const map = new Map<number | string, any>();

    const pushIfNew = (item: any) => {
      const id = item?.idUsuario;
      if (id == null) return;
      if (!map.has(id)) map.set(id, item);
      else {
        // mesclar campos faltantes do item no registro já existente
        const existing = map.get(id);
        map.set(id, { ...item, ...existing });
      }
    };

    (apiData.usuarios || []).forEach(pushIfNew);
    (apiData.hospedes || []).forEach(pushIfNew);
    // mapear funcionários para formato similar a usuário antes de inserir
    (apiData.funcionarios || []).forEach((f: any) => {
      const item = {
        idUsuario: f.idUsuario,
        nomeHospede: f.nomeLogin || f.nomeHospede || "N/A",
        cpf: f.cpf ?? undefined,
        rg: f.rg ?? undefined,
        sexo: f.sexo ?? undefined,
        dataNascimento: f.dataNascimento ?? undefined,
        email: f.email ?? undefined,
        telefone: f.telefone ?? undefined,
        tipo: 1,
        ativo: f.ativo ?? true,
      };
      pushIfNew(item);
    });

    data = Array.from(map.values());
  } else {
    data = apiData[activeTab] || [];

    // Filtro para hóspedes
    if (activeTab === "hospedes") {
      data = data.filter((d: any) => d.tipo === 0);
    }

    // Filtro para funcionários (join com hospedes)
    if (activeTab === "funcionarios") {
      data = data.map((f: any) => {
        const h = (apiData.usuarios || []).find(
          (u: any) => u.idUsuario === f.idUsuario
        );
        return { ...f, nomeHospede: h?.nomeHospede || "N/A" };
      });
    }
  }

  const filteredData = data.filter((item: any) =>
    Object.values(item).some((v) =>
      v?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ============================================================
  // Parte 6 - Utilitário de Feedback Visual (Toast)
  // ============================================================
  // 1. Função `showToast` exibe mensagens temporárias de sucesso ou erro.
  // 2. Define tipo do toast (`success` ou `error`) e limpa automaticamente após 3 segundos.
  // 3. Usada por todas as ações de UI para dar feedback imediato ao usuário.
  // 4. Centraliza o comportamento de notificações, evitando repetição de código.
  // 5. Integrada diretamente nas funções de ação (criar, editar, excluir).

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ============================================================
  // Parte 7 - Carregamento de Dados do Backend (quando USE_MOCK = false)
  // ============================================================
  // 1. `useEffect` monitora mudanças em `activeTab` e dispara requisições apenas se mock estiver desativado.
  // 2. Define base URL do backend e mapeamento detalhado de abas para endpoints REST reais.
  // 3. Suporta endpoints únicos ou múltiplos (ex: "usuarios" consulta dois endpoints).
  // 4. Desembrulha envelope de resposta padrão do backend (`res.data.dados`) com fallback seguro.
  // 5. Trata erros com toast e console, mantendo a UI estável mesmo com falhas de rede.

  // Buscar os dados da aba atual no backend
  useEffect(() => {
    const backendMap: { [key: string]: string | string[] } = {
      usuarios: ["/hospede/listar", "/funcionario/listar"],
      hospedes: "/hospede/listar",
      funcionarios: "/funcionario/listar",
      funcoes: "/funcao/listar",
      "tipos-quarto": "/tipo-quarto/listar",
      quartos: "/quarto/listar",
      "status-reserva": "/status-reserva/listar",
      reservas: "/reserva/listar",
      servicos: "/servico/listar",
      "hospede-servico": "/hospede-servico/listar",
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setHateoasLinks(null);

        const mapping = backendMap[activeTab];
        if (!mapping) {
          showToast("Endpoint backend não mapeado para esta aba", "error");
          setLoading(false);
          return;
        }

        const endpoints = Array.isArray(mapping) ? mapping : [mapping];
        const results: any[] = [];
        let pageInfo: any = null;

        for (const ep of endpoints) {
          const url = `${ep}?page=${currentPage}&pageSize=${pageSize}`;
          const res = await http.get(url);
          const payload = res?.data?.dados ?? res?.data ?? [];
          const linkPayload = res?.data?._link ?? res?.data?.dados?._link ?? null;
          if (linkPayload) {
            setHateoasLinks(linkPayload);
          }

          if (payload && typeof payload === "object" && Array.isArray(payload.content)) {
            results.push(payload.content);
            pageInfo = payload;
          } else if (Array.isArray(payload)) {
            results.push(payload);
          } else if (payload && typeof payload === "object") {
            results.push([payload]);
          }
        }

        const merged = ([] as any[]).concat(...results);
        setApiData((prev) => ({ ...prev, [activeTab]: merged }));

        if (pageInfo) {
          setTotalElements(pageInfo.totalElements ?? merged.length);
          setTotalPages(pageInfo.totalPages ?? 1);
          setShowPagingInfo(true);
        } else {
          setTotalElements(merged.length);
          setTotalPages(1);
          setShowPagingInfo(false);
        }
      } catch (err) {
        console.error(err);
        showToast("Erro ao carregar dados do servidor", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage, pageSize]);

  // ============================================================
  // Parte 8 - Funções de Ação do Usuário (CRUD Simulado)
  // ============================================================
  // 1. `handleCreate`: exibe toast informando que a criação está em desenvolvimento.
  // 2. `handleEdit`: navega para tela de atualização via `ROTA` e exibe toast de confirmação.
  // 3. `handleDelete`: solicita confirmação via `confirm()` e exibe toast de sucesso simulado.
  // 4. Todas as funções mantêm feedback visual imediato via `showToast`.
  // 5. Estrutura preparada para integração futura com chamadas reais ao backend.

  // Ao clicar no botão "Criar", mostra a mensagem de toast

  // Mapeamento simples das abas para as rotas React definidas em `ROTA`.
  // Usamos apenas os 5 módulos solicitados: Hóspede, Função, Funcionário, Tipo-Quarto, Quarto.
  const routeMap: { [key: string]: any } = {
    hospedes: ROTA.HOSPEDE,
    funcoes: ROTA.FUNCAO,
    funcionarios: ROTA.FUNCIONARIO,
    "tipos-quarto": ROTA.TIPO_QUARTO,
    quartos: ROTA.QUARTO,
  };

  const handleCreate = () => {
    const mapping = routeMap[activeTab];
    if (mapping) {
      try {
        navigate(mapping.CRIAR);
        return;
      } catch (err) {
        console.error("Erro ao navegar para criar:", err);
      }
    }
    showToast("Funcionalidade de criação em desenvolvimento", "success");
  };

  // como tava antes (eu gostava):
  // const handleEdit = (id: number) => showToast(`Editar item ID: ${id}`, "success");
  const handleEdit = (id: number) => {
    const mapping = routeMap[activeTab];
    if (mapping) {
      try {
        navigate(`${mapping.ATUALIZAR}/${id}`);
      } catch (err) {
        console.error("Erro ao navegar para alterar:", err);
        showToast(`Erro ao navegar para alterar item ID: ${id}`, "error");
      }
    } else {
      // fallback mantido
      try {
        navigate(`${ROTA.HOSPEDE.ATUALIZAR}/${id}`);
      } catch (err) {
        console.error("Erro ao navegar (fallback):", err);
      }
    }

    showToast(`Editar item ID: ${id}`, "success");
  };
  const handleDelete = (id: number) => {
    if (!confirm(`Tem certeza que deseja excluir o item ID: ${id}?`)) return;
    const mapping = routeMap[activeTab];
    if (mapping) {
      try {
        navigate(`${mapping.EXCLUIR}/${id}`);
        return;
      } catch (err) {
        console.error("Erro ao navegar para excluir:", err);
      }
    }
    // fallback: apenas simular exclusão
    showToast(`Item ID ${id} excluído (simulação)`, "success");
  };

  const handleConsult = (id: number) => {
    const mapping = routeMap[activeTab];
    if (mapping) {
      try {
        navigate(`${mapping.POR_ID}/${id}`);
        return;
      } catch (err) {
        console.error("Erro ao navegar para consultar:", err);
        showToast(`Erro ao navegar para consultar item ID: ${id}`, "error");
      }
    }
    showToast("Consulta não disponível para esta aba", "error");
  };

  // ============================================================
  // Parte 9 - Formatação de Valores para Exibição
  // ============================================================
  // 1. Função `formatValue` recebe chave e valor, retornando representação amigável.
  // 2. Converte booleanos para "Sim"/"Não", datas para formato brasileiro, valores monetários com R$.
  // 3. Aplica badges estilizados para status de quarto com classes CSS específicas.
  // 4. Retorna fallback "-" para valores nulos ou indefinidos.
  // 5. Garante consistência visual em toda a tabela, independentemente da origem dos dados.

  const formatValue = (key: string, value: any): string | ReactNode => {
    if (value === true) return "Sim";
    if (value === false) return "Não";
    const k = key.toString().toLowerCase();
    if (k.includes("data")) {
      const d = new Date(value);
      return isNaN(d.getTime())
        ? "Invalid Date"
        : d.toLocaleDateString("pt-BR");
    }
    if (k.includes("valor") || k === "preco")
      return `R$ ${parseFloat(value).toFixed(2)}`;
    // Badge de status do quarto (resumo didático):
    // - O `key` que identifica status é tratado case-insensitive (ex.:
    //   'statusQuarto' -> 'statusquarto').
    // - Mapeamos o valor textual do backend para uma classe CSS:
    //     'LIVRE'      => 'status-livre'      (verde)
    //     'OCUPADO'    => 'status-ocupado'    (vermelho)
    //     qualquer outro => 'status-manutencao' (amarelo)
    // - A tag retornada é <span className="status-badge {classe}">valor</span>,
    //   permitindo ao CSS (arquivo de estilos) colorir o fundo/borda conforme a
    //   classe. Dessa forma só controlamos a lógica aqui e delegamos a aparência
    //   às regras CSS (.status-badge.status-livre etc.).
    if (k === "status_quarto" || k === "statusquarto") {
      const status =
        value === "LIVRE"
          ? "status-livre"
          : value === "OCUPADO"
          ? "status-ocupado"
          : "status-manutencao";
      return <span className={`status-badge ${status}`}>{value}</span>;
    }
    return value?.toString() || "-";
  };

  // ============================================================
  // Parte 10 - Renderização JSX (Estrutura Visual Completa)
  // ============================================================
  // 1. Container principal com classes semânticas para estilização.
  // 2. Breadcrumb com navegação para dashboard e indicação de página atual.
  // 3. Banner com ícone, título e subtítulo explicativo do propósito da ferramenta.
  // 4. Seção de abas com rolagem horizontal e destaque visual da aba ativa.
  // 5. Área principal com busca, botão de criação, tabela responsiva, ações por linha e toast flutuante.

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
          <span className="text-gray-600">Dev Tools</span>
        </div>
      </nav>

      {/* Banner */}
      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-tools text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dev Tools</h1>
          <p className="text-xl">Painel de Administração - Simulação DDL</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="devtools-tabs">
        <div className="container">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`devtools-tab ${
                  activeTab === tab.key ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
              {currentTab.label}
            </h3>
            <div className="flex space-x-2">
              {/*
                Campo de Busca (Resumo didático):
                - Estado: `searchTerm` guarda o texto digitado pelo usuário.
                - Comportamento: a cada alteração (`onChange`) atualizamos
                  `searchTerm` imediatamente; não há debounce por enquanto.
                - Filtragem: o array `filteredData` é calculado ao final da
                  preparação dos dados e aplica este filtro global:
                    Object.values(item).some(v => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                  Ou seja: procura a substring digitada em qualquer campo
                  do registro, de forma case-insensitive.
                - Reinício: ao trocar de aba (`setActiveTab`) o `searchTerm`
                  é limpo para evitar resultados escondidos de outra aba.
                - Melhorias possíveis: adicionar debounce, mapear colunas a
                  rótulos legíveis, ou oferecer filtro por coluna.
              */}
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
                type="button"
                onClick={() => setShowHateoasLinks((prev) => !prev)}
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 bg-white hover:bg-gray-100 transition"
              >
                {showHateoasLinks ? "Ocultar HATEOAS" : "Mostrar HATEOAS"}
              </button>
              {/* Esconde o botão "Criar" apenas na aba Usuarios (Todos) */}
              {activeTab !== "usuarios" && (
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  <i className="fas fa-plus mr-1"></i>Criar
                </button>
              )}
            </div>
          </div>
          <div className="table-container">
            <table className="dev-table">
              <thead>
                <tr>
                  {currentTab.columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={currentTab.columns.length + 1}
                      className="text-center py-4 text-gray-500"
                    >
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item: any) => {
                    const id =
                      item.idUsuario ||
                      item.idQuarto ||
                      item.idReserva ||
                      item.codigoFuncao ||
                      item.codigoTipoQuarto ||
                      item.codigoStatus ||
                      item.codigoServico ||
                      item.idSolicitacao;
                    return (
                      <tr key={id}>
                        {currentTab.columns.map((col) => (
                          <td key={col}>{formatValue(col, item[col])}</td>
                        ))}

                        <td className="actions">
                          <button
                            onClick={() => handleConsult(id)}
                            className="btn-show"
                            title="Consultar"
                          >
                            <i className="fas fa-eye"></i>
                          </button>

                          <button
                            onClick={() => handleEdit(id)}
                            className="btn-edit"
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>

                          <button
                            onClick={() => handleDelete(id)}
                            className="btn-delete"
                            title="Excluir"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-3">
            {loading && (
              <div className="text-center text-gray-600">Carregando dados...</div>
            )}

            {showPagingInfo && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700">
                <div>
                  Mostrando página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>, total de <strong>{totalElements}</strong> registros.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}

            {/* Exibição dos links HATEOAS (Resumo didático): 
            
            Aqui vemos como o HATEOAS pode ser integrado na interface de administração:
- O estado `hateoasLinks` armazena os links retornados pelo backend (se houver).
- O botão "Mostrar HATEOAS" alterna a visibilidade desta seção.
- Se `showHateoasLinks` for verdadeiro e `hateoasLinks` contiver dados, renderizamos um card com a lista de links.
- Cada link é exibido com seu nome (chave), método HTTP e URL (href).
- Isso permite aos desenvolvedores verem facilmente quais ações relacionadas estão disponíveis para o recurso atual, facilitando testes e exploração da API.
            
            O HATEOAS serve para mostrar as relações e ações possíveis a partir do recurso atual, 
            e esta seção é uma forma prática de expor isso na interface de administração, ajudando no desenvolvimento e depuração.

            Por que usar o HATEOAS?
- Descoberta Dinâmica: Permite que os clientes descubram ações relacionadas sem precisar de documentação externa.
- Navegação Contextual: Mostra quais operações estão disponíveis para o recurso atual, melhorando a experiência do desenvolvedor.
- Flexibilidade: O backend pode adicionar ou remover links conforme necessário, sem quebrar o cliente, desde que o cliente saiba interpretar os links.
            */}

            {showHateoasLinks && hateoasLinks && Object.keys(hateoasLinks).length > 0 && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="font-semibold mb-2">HATEOAS Links</div>
                <ul className="list-disc list-inside text-sm">
                  {Object.entries(hateoasLinks).map(([key, link]) => (
                    <li key={key}>
                      <span className="font-medium">{key}</span> — {link.method} <code>{link.href}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* DOCUMENTAÇÃO, COMO RESOLVERMOS O PROBLEMA, LOGO ABAIXO: */
/*
  DOCUMENTAÇÃO DETALHADA — passos executados para corrigir o problema

  Resumo do problema observado:
  - A aba "Funcionários" fazia a requisição corretamente (200 OK) mas a tabela
    do React mostrava células vazias ("-") e datas como "Invalid Date".
  - A aba "Usuários (Todos)" deveria juntar Hóspedes + Funcionários, mas os
    funcionários não eram incluídos porque o front esperava chaves em UPPERCASE
    (ex.: ID_USUARIO) enquanto o backend devolvia objetos em camelCase
    (ex.: idUsuario, dataContratacao).

  Alterações realizadas (arquivo → resumo das mudanças):

  1) Ativação do módulo Funcionario no NestJS
     - Arquivo: nest_academic/src/app/app.module.ts
     - Ação: descomentei/importei `FuncionarioModule` e o adicionei ao array
       `imports` do AppModule (isso expôs as rotas /rest/sistema/v1/funcionario/*).

  2) Debug no backend para confirmar que o banco retornava linhas
     - Arquivo: nest_academic/src/3-funcionario/service/funcionario.service.findall.ts
     - Ação: adicionei logs (console.log) imediatamente após o fetch:
         console.log('[FuncionarioServiceFindAll] registros encontrados:', funcionarios?.length ?? 0);
         console.log('[FuncionarioServiceFindAll] amostra:', funcionarios?.slice(0, 5));
     - Objetivo: verificar no console do servidor se TypeORM realmente retornava registros.
     - Resultado observado (exemplo do console):
         query: SELECT "funcionario"... FROM "COCAO_FUNCIONARIO" "funcionario"
         [FuncionarioServiceFindAll] registros encontrados: 2
         [FuncionarioServiceFindAll] amostra: [ Funcionario { idUsuario: 44, ... }, Funcionario { idUsuario: 45, ... } ]

  3) Corrigir duplicação/contradição de URL entre baseURL e endpoints
     - Arquivo: react_academic/src/services/constants/sistema.constant.ts
     - Ação: Ajustei `REST_CONFIG.BASE_URL` para conter o prefixo correto
       ("http://localhost:8000/rest/sistema/v1"). Antes havia discrepância que
       gerava chamadas como: http://localhost:8000/rest/sistema/v1/rest/sistema/v1/...
     - Arquivo: react_academic/src/views/DevTools.tsx
       - Atualizei `backendMap` para usar caminhos relativos após o baseURL,
         por exemplo '/funcionario/listar' (o baseURL já inclui /rest/sistema/v1).

  4) Debug e normalização no frontend (`DevTools.tsx`)
     - Importei `REST_CONFIG` para facilitar logs de URL completa.
     - Adicionei logs detalhados no `fetchData` para cada etapa da requisição:
         console.log('Fetching data for tab:', activeTab);
         console.log('Using endpoint mapping:', mapping);
         console.log('Fetching endpoint:', ep);
         console.log('Full URL:', `${REST_CONFIG.BASE_URL}${ep}`);
         console.log('Raw response:', res);
         console.log('Processed payload:', payload);
         console.log('Final processed payload:', processedPayload);
         console.log('Final merged data:', merged);
     - Objetivo: ver exatamente o que chega do servidor e como é processado.

  5) Normalizar nomes das colunas e do processamento para camelCase
     - Arquivo: react_academic/src/views/DevTools.tsx
     - Problema: backend retorna DTOs em camelCase (ex.: idUsuario, nomeLogin,
       dataContratacao). O frontend usava nomes em UPPER_SNAKE (ex.: ID_USUARIO),
       então as células ficavam vazias porque item['ID_USUARIO'] === undefined.
     - Ações implementadas:
       * Atualizei `tabs` para usar chaves camelCase (ex.: 'idUsuario',
         'nomeLogin', 'codigoFuncao', 'dataContratacao').
       * Ajustei a função que monta a lista "usuarios" (`pushIfNew`) para ler
         `item.idUsuario` em vez de `item.ID_USUARIO`.
       * Ao mesclar `funcionarios` dentro de `usuarios`, normalizei os campos
         (ex.: idUsuario, nomeHospede, cpf, dataNascimento, tipo, ativo).
       * Atualizei os filtros/joins para procurar `tipo` e `idUsuario` em
         camelCase (ex.: `d.tipo === 0`, `u.idUsuario === f.idUsuario`).
       * Ajustei a extração do id de cada linha da tabela para checar propriedades
         camelCase (ex.: `item.idUsuario || item.codigoFuncao || ...`).

  6) Melhorias na formatação de valores (datas, booleanos)
     - Arquivo: react_academic/src/views/DevTools.tsx
     - Ação: Atualizei `formatValue` para ser case-insensitive e reconhecer
       chaves camelCase que contenham "data" (ex.: dataContratacao,
       dataNascimento). Agora converte corretamente para pt-BR e mostra
       "Invalid Date" de forma explícita quando o valor não é uma data válida.

  7) Ajuste no envelope de resposta e flattening
     - O frontend já estava tratando `res.data.dados` quando presente. Mantive
       esse comportamento e o normalizei (transformar payload não-array em array
       para garantir uniformidade). Depois faço o flatten com concat(...results).

  8) Resultado e verificação
     - Depois das mudanças, o console do frontend mostrou payloads válidos e o
       estado `apiData` passou a conter os arrays esperados (ex.: `funcoes: Array(6)`,
       `funcionarios: Array(2)`). A tabela passou a renderizar valores corretos
       — incluindo `dataContratacao` formatada.


  O que eu preciso fazer:

  - remover os console.log de debug (frontend e backend).
  - adaptar a UI para mostrar rótulos legíveis (mapeando chaves → labels).
  - Próximo passo: implementar criar/editar/excluir no frontend usando os
    DTOs camelCase e escrever testes rápidos (Postman) para os endpoints.
*/
