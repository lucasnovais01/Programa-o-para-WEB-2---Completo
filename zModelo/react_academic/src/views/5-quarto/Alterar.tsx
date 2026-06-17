import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import "../../assets/css/7-form.css";
import { apiGetTiposQuarto } from "../../services/4-tipo-quarto/api/api.tipo-quarto";
import {
  apiGetQuarto,
  apiPutQuarto,
} from "../../services/5-quarto/api/api.quarto";
import { QUARTO } from "../../services/5-quarto/constants/quarto.constants";
import type { TipoQuarto } from "../../type/4-tipo-quarto";
import type { Quarto } from "../../type/5-quarto";

import { ROTA } from "../../services/router/url";
import {
  createHandleChangeField,
  createShowMensagem,
  createValidateField,
  getInputClass,
} from "./zCamposAlterar";

export default function AlterarQuarto() {
  const { idQuarto } = useParams<{ idQuarto: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Quarto>(
    QUARTO.DADOS_INICIAIS as unknown as Quarto
  );
  const [errors, setErrors] = useState<any>({});
  const [tiposQuarto, setTiposQuarto] = useState<TipoQuarto[]>([]);

  const handleChangeField = createHandleChangeField(setModel, setErrors);
  const validateField = createValidateField(setErrors);
  const showMensagem = createShowMensagem(errors);

  const extractTiposQuarto = (dados: any): TipoQuarto[] => {
    if (Array.isArray(dados)) return dados;
    if (dados && Array.isArray(dados.content)) return dados.content;
    return [];
  };

  useEffect(() => {
    async function loadData() {
      try {
        // Carregar tipos de quarto
        const resTipos = await apiGetTiposQuarto(1, 100);
        const dadosTipos = resTipos?.data?.dados;
        setTiposQuarto(extractTiposQuarto(dadosTipos));

        // Carregar quarto
        if (idQuarto) {
          const res = await apiGetQuarto(Number(idQuarto));
          const dados = res?.data?.dados;
          if (dados) setModel(dados);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        alert("Erro ao carregar dados");
      }
    }

    loadData();
  }, [idQuarto]);

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idQuarto || !model) {
      alert("Dados incompletos para atualização");
      return;
    }

    try {
      const toSend: Quarto = {
        codigoTipoQuarto: Number(model.codigoTipoQuarto),
        numero: Number(model.numero),
        statusQuarto: model.statusQuarto,
        andar: Number(model.andar ?? 0),
      } as Quarto;

      console.log("[AlterarQuarto] Enviando:", JSON.stringify(toSend, null, 2));

      await apiPutQuarto(Number(idQuarto), toSend);

      navigate(ROTA.QUARTO.LISTAR, {
        state: {
          toast: {
            message: `Quarto ${idQuarto} alterado com sucesso!`,
            type: "success",
          },
        },
      });
    } catch (err) {
      console.error("Erro ao atualizar quarto:", err);
      alert("Erro ao atualizar quarto");
    }
  };

  const onCancel = () => navigate(ROTA.QUARTO.LISTAR);

  if (!model) {
    return (
      <div className="padraoPagina">
        <div className="container py-8 text-center">
          <i className="fas fa-spinner fa-spin text-4xl"></i>
          <p className="mt-4">Carregando...</p>
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
            to={ROTA.QUARTO.LISTAR}
            className="text-blue-600 hover:text-blue-700"
          >
            Quartos
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Alterar</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-tools text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Alterar Quarto
          </h1>
          <p className="text-xl">Edição de quarto</p>
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
                title="Salvar alterações"
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
