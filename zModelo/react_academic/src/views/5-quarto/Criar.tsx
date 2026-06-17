import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

import "../../assets/css/7-form.css";
import { apiGetTiposQuarto } from "../../services/4-tipo-quarto/api/api.tipo-quarto";
import { apiPostQuarto } from "../../services/5-quarto/api/api.quarto";
import { QUARTO } from "../../services/5-quarto/constants/quarto.constants";
import type { TipoQuarto } from "../../type/4-tipo-quarto";
import type { Quarto } from "../../type/5-quarto";

import { ROTA } from "../../services/router/url";
import {
  createHandleChangeField,
  createShowMensagem,
  createValidateField,
  getInputClass,
} from "./zCamposCriar";

export default function CriarQuarto() {
  const navigate = useNavigate();
  const [model, setModel] = useState<Quarto>(
    QUARTO.DADOS_INICIAIS as unknown as Quarto
  );
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [tiposQuarto, setTiposQuarto] = useState<TipoQuarto[]>([]);

  const handleChangeField = createHandleChangeField(setModel, setErrors);
  const validateField = createValidateField(setErrors);
  const showMensagem = createShowMensagem(errors);

  const extractTiposQuarto = (dados: any): TipoQuarto[] => {
    if (Array.isArray(dados)) return dados;
    if (dados && Array.isArray(dados.content)) return dados.content;
    return [];
  };
  /*
   * loadTipos (didático)
   * --------------------
   * O objetivo desta função é buscar no backend a lista de "Tipos de Quarto"
   * (tabela de referência / lookup) para popular o <select> que representa a
   * chave estrangeira `codigoTipoQuarto` no formulário de criação.
   *
   * Fluxo resumido:
   * 1) Chamamos `apiGetTiposQuarto()` que faz um GET na rota do backend.
   *    - O axios retorna um objeto `res` e o corpo está em `res.data`.
   *    - No padrão do backend deste projeto, o corpo tem a propriedade
   *      `dados` (ex: `res.data.dados`) que contém o array de registros.
   * 2) Extraímos `dados` com fallback para array vazio e validamos com
   *    `Array.isArray(dados)` para garantir que recebemos uma lista.
   * 3) Guardamos o resultado no estado local `tiposQuarto` com
   *    `setTiposQuarto(dados)`. Esse estado é usado logo abaixo para
   *    renderizar as <option> do <select>.
   *
   * Por que isso é útil / boas práticas:
   * - Permite ao usuário escolher o tipo a partir de valores reais no banco,
   *   evitando inputs manuais e inconsistências (FK garantida pelo frontend).
   * - Mantém o formulário desacoplado do backend: caso a lista mude,
   *   o select é atualizado automaticamente na próxima navegação.
   * - Boa ideia: cachear os tipos (ex: em contexto/global) se forem usados
   *   frequentemente, para reduzir chamadas repetidas.
   *
   * Observações de implementação:
   * - Tratamos erros com try/catch e apenas logamos aqui; você pode exibir
   *   uma mensagem ao usuário se quiser.
   * - Garantir que o backend retorne `res.data.dados` no formato esperado
   *   (cada item tem `codigoTipoQuarto` e `nomeTipo`) para que o <option>
   *   funcione corretamente.
   */
  useEffect(() => {
    async function loadTipos() {
      try {
        const res = await apiGetTiposQuarto(1, 100);
        const dados = res?.data?.dados;
        setTiposQuarto(extractTiposQuarto(dados));
      } catch (err) {
        console.error("[CriarQuarto] Erro ao carregar tipos de quarto:", err);
      }
    }

    loadTipos();
  }, []);

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!model) {
      alert("Dados incompletos para criação");
      return;
    }

    setLoading(true);

    try {
      const quartoToSend = {
        codigoTipoQuarto: Number(model.codigoTipoQuarto),
        numero: Number(model.numero),
        statusQuarto: model.statusQuarto || "LIVRE",
        andar: Number(model.andar ?? 0),
      } as Quarto;

      console.log(
        "[onSubmitForm] Dados a enviar:",
        JSON.stringify(quartoToSend, null, 2)
      );

      await apiPostQuarto(quartoToSend);

      navigate(ROTA.QUARTO.LISTAR, {
        state: {
          toast: {
            message: QUARTO.OPERACAO.CRIAR.SUCESSO,
            type: "success",
          },
        },
      });
    } catch (error: any) {
      console.error("[onSubmitForm] Erro:", error);
      alert(QUARTO.OPERACAO.CRIAR.ERRO);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => navigate(ROTA.QUARTO.LISTAR);

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
            to={ROTA.QUARTO.LISTAR}
            className="text-blue-600 hover:text-blue-700"
          >
            Quartos
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Novo Quarto</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-door-open text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {QUARTO.TITULO.CRIAR}
          </h1>
          <p className="text-xl">Crie um novo quarto</p>
        </div>
      </section>

      <main className="container py-8">
        <div
          className="card animated fadeInDown"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <form onSubmit={onSubmitForm}>
            <div className="form-grid">
              <div className="form-group">
                <label
                  htmlFor={QUARTO.FIELDS.CODIGO_TIPO_QUARTO}
                  className="appLabel"
                >
                  {QUARTO.LABEL.CODIGO_TIPO_QUARTO}
                </label>
                <div className="form-field-wrapper">
                  <select
                    id={QUARTO.FIELDS.CODIGO_TIPO_QUARTO}
                    name={QUARTO.FIELDS.CODIGO_TIPO_QUARTO}
                    value={model.codigoTipoQuarto || 0}
                    className={getInputClass(
                      errors,
                      QUARTO.FIELDS.CODIGO_TIPO_QUARTO
                    )}
                    onChange={(e) =>
                      handleChangeField(
                        QUARTO.FIELDS.CODIGO_TIPO_QUARTO as keyof Quarto,
                        Number(e.target.value)
                      )
                    }
                    onBlur={(e) =>
                      validateField(
                        QUARTO.FIELDS.CODIGO_TIPO_QUARTO as keyof Quarto,
                        e
                      )
                    }
                  >
                    <option value={0}>-- Selecione um tipo de quarto --</option>
                    {tiposQuarto.map((t) => (
                      <option
                        key={t.codigoTipoQuarto}
                        value={t.codigoTipoQuarto}
                      >
                        {t.nomeTipo} ({t.codigoTipoQuarto})
                      </option>
                    ))}
                  </select>
                  {showMensagem(QUARTO.FIELDS.CODIGO_TIPO_QUARTO)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={QUARTO.FIELDS.NUMERO} className="appLabel">
                  {QUARTO.LABEL.NUMERO}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={QUARTO.FIELDS.NUMERO}
                    name={QUARTO.FIELDS.NUMERO}
                    type="number"
                    value={model.numero || ""}
                    className={getInputClass(errors, QUARTO.FIELDS.NUMERO)}
                    onChange={(e) =>
                      handleChangeField(
                        QUARTO.FIELDS.NUMERO as keyof Quarto,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(QUARTO.FIELDS.NUMERO as keyof Quarto, e)
                    }
                  />
                  {showMensagem(QUARTO.FIELDS.NUMERO)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={QUARTO.FIELDS.STATUS} className="appLabel">
                  {QUARTO.LABEL.STATUS}
                </label>
                <div className="form-field-wrapper">
                  <select
                    id={QUARTO.FIELDS.STATUS}
                    name={QUARTO.FIELDS.STATUS}
                    value={model.statusQuarto || "LIVRE"}
                    className={getInputClass(errors, QUARTO.FIELDS.STATUS)}
                    onChange={(e) =>
                      handleChangeField(
                        QUARTO.FIELDS.STATUS as keyof Quarto,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(QUARTO.FIELDS.STATUS as keyof Quarto, e)
                    }
                  >
                    {QUARTO.STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {showMensagem(QUARTO.FIELDS.STATUS)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={QUARTO.FIELDS.ANDAR} className="appLabel">
                  {QUARTO.LABEL.ANDAR}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={QUARTO.FIELDS.ANDAR}
                    name={QUARTO.FIELDS.ANDAR}
                    type="number"
                    value={model.andar || 0}
                    className={getInputClass(errors, QUARTO.FIELDS.ANDAR)}
                    onChange={(e) =>
                      handleChangeField(
                        QUARTO.FIELDS.ANDAR as keyof Quarto,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(QUARTO.FIELDS.ANDAR as keyof Quarto, e)
                    }
                  />
                  {showMensagem(QUARTO.FIELDS.ANDAR)}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                id="submit"
                type="submit"
                className="btn btn-sucess"
                title={QUARTO.OPERACAO.CRIAR.ACAO}
                disabled={loading}
              >
                <span className="btn-icon">
                  <i>
                    <FaSave />
                  </i>
                </span>
                Salvar
              </button>

              <button
                id="cancel"
                type="button"
                className="btn btn-cancel"
                title="Cancelar"
                onClick={onCancel}
                disabled={loading}
              >
                <span className="btn-icon">
                  <i>
                    <MdCancel />
                  </i>
                </span>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
