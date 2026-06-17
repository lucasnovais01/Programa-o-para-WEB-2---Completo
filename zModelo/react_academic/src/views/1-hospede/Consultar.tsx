import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { apiGetHospede } from "../../services/1-hospede/api/api.hospede";
import { HOSPEDE } from "../../services/1-hospede/constants/hospede.constants";
import { ROTA } from "../../services/router/url";
import type { Hospede } from "../../type/1-hospede";

import "../../assets/css/7-form.css";

// ============================================================
// COMPONENTE: Consultar Hóspede
// ============================================================
// Propósito: Exibir os dados de um hóspede de forma formatada
// e organizada, seguindo o padrão de layout do Alterar.tsx
// ============================================================

export default function ConsultarHospede() {
  // ============================================================
  // Estado e hooks
  // ============================================================
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Hospede | null>(null);
  const [loading, setLoading] = useState(true);

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
  // Render
  // ============================================================
  // Sobre inputs READ-ONLY (somente leitura):
  // ────────────────────────────────────────
  // Existem 3 formas principais de tornar um input read-only:
  //
  // 1️⃣  readOnly (recomendado para inputs)
  //   - O usuário NÃO consegue digitar/editar
  //   - O valor é ENVIADO no form submit (se houver)
  //   - Exemplo: <input readOnly value="João" />
  //   - Aparência: Texto normal, sem aparência "desabilitada"
  //
  // 2️⃣  disabled (desabilita completamente)
  //   - O usuário NÃO consegue digitar/editar
  //   - O valor NÃO é enviado no form submit
  //   - Exemplo: <input disabled value="João" />
  //   - Aparência: Acinzentada/desabilitada (mais óbvio)
  //
  // 3️⃣  onChange={(e) => {}} (bloqueia mudanças)
  //   - O usuário pode clicar mas não consegue digitar
  //   - Menos recomendado, mais confuso
  //
  // QUAL USAR AQUI (Consultar.tsx)?
  // ────────────────────────────────
  // Usamos AMBOS: readOnly + disabled
  //
  // readOnly: Impede digitação
  // disabled: Deixa visualmente claro que não é editável
  //
  // Exemplo de um input:
  // <input
  //   type="text"
  //   value={model.nomeHospede || "-"}
  //   readOnly        ← O usuário não consegue digitar
  //   disabled        ← Fica cinzento/desabilitado
  // />
  //
  // Isso é OVERKILL? Sim! Mas é seguro e claro.
  // Você pode usar só um deles:
  //   - Só readOnly: se quer deixar "normalmente"
  //   - Só disabled: se quer deixar "cinzento"
  //
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
          <span className="text-gray-600">Consultar</span>
        </div>
      </nav>

      {/* Banner */}
      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-search text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Consultar Usuário
          </h1>
          <p className="text-xl">Visualize as informações do hospédes e funcionários</p>
        </div>
      </section>

      {/* Content */}
      <main className="container py-8">
        <div
          className="card animated fadeInDown"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <h2>{HOSPEDE.TITULO.CONSULTAR}</h2>
          <br />
          <br />

          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          ) : model ? (
            <form>
              <div className="form-grid">
                {/* 
                Campo: ID Usuario (read-only)
                
                EXPLICAÇÃO: Como tornar um input SOMENTE LEITURA
                ───────────────────────────────────────────────
                
                Neste input, usamos DUAS propriedades para garantir
                que o usuário NÃO possa editar:
                
                1. readOnly={true}
                   - Propriedade HTML padrão
                   - Impede que o usuário DIGITE
                   - Visualmente parece normal (não fica cinzento)
                   - Se fosse um formulário real, esse valor SERIA enviado
                
                2. disabled={true}
                   - Propriedade HTML padrão
                   - Desabilita o input completamente
                   - Fica CINZENTO/DESABILITADO visualmente
                   - Se fosse um formulário real, esse valor NÃO seria enviado
                
                Por que os dois?
                - readOnly impede edição
                - disabled deixa claro visualmente que não é editável
                - Juntos garantem segurança máxima
                
                Você pode usar:
                ✅ Só readOnly (parece normal, mas não edita)
                ✅ Só disabled (fica cinzento, mas não edita)
                ✅ Os dois (máxima segurança + visual claro) ← USAMOS AQUI
                
                Exemplo deste input:
                <input
                  type="text"
                  value={model.idUsuario || "-"}
                  className="form-control app-label mt-2"
                  readOnly    ← Não consegue digitar
                  disabled    ← Fica cinzento
                />
                
                Resultado: Campo cinzento, não editável, 100% seguro!
                -->
                <div className="form-group">
                  <label className="appLabel">ID</label>
                  <div className="form-field-wrapper">
                    <input
                      type="text"
                      value={model.idUsuario || "-"}
                      className="form-control app-label mt-2"
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                {/* Campo: Nome Completo */}
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

                {/* Campo: Tipo */}
                <div className="form-group">
                  <label className="appLabel">Tipo</label>
                  <div className="form-field-wrapper">
                    <input
                      type="text"
                      value={formatValue("tipo", model.tipo)}
                      className="form-control app-label mt-2"
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                {/* Campo: Ativo */}
                <div className="form-group">
                  <label className="appLabel">Ativo</label>
                  <div className="form-field-wrapper">
                    <input
                      type="text"
                      value={formatValue("ativo", model.ativo)}
                      className="form-control app-label mt-2"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Botão de Ação */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => navigate(ROTA.HOSPEDE.LISTAR)}
                >
                  <span className="btn-icon">
                    <i>
                      <MdArrowBack />
                    </i>
                  </span>
                  Voltar
                </button>
              </div>
            </form>
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
