/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import "../../assets/css/7-form.css";
import {
  apiGetTipoQuarto,
  apiPutTipoQuarto,
} from "../../services/4-tipo-quarto/api/api.tipo-quarto";
import { TIPO_QUARTO } from "../../services/4-tipo-quarto/constants/tipo-quarto.constants";
import type { TipoQuarto } from "../../type/4-tipo-quarto";

import { ROTA } from "../../services/router/url";
import {
  createHandleChangeField,
  createShowMensagem,
  createValidateField,
} from "./zCamposAlterar";

export default function AlterarTipoQuarto() {
  const { codigoTipoQuarto } = useParams<{ codigoTipoQuarto: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<TipoQuarto | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleChangeField = createHandleChangeField(setModel, setErrors);
  const validateField = createValidateField(setErrors);
  const showMensagem = createShowMensagem(errors);

  useEffect(() => {
    async function getTipo() {
      try {
        if (codigoTipoQuarto) {
          const response = await apiGetTipoQuarto(Number(codigoTipoQuarto));
          if (response.data.dados) {
            setModel(response.data.dados);
          }
        }
      } catch (error: any) {
        console.log(error);
        alert("Erro ao carregar tipo de quarto");
      }
    }

    getTipo();
  }, [codigoTipoQuarto]);

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigoTipoQuarto || !model) {
      alert("Dados incompletos para atualização");
      return;
    }

    try {
      const toSend = {
        codigoTipoQuarto: Number(model.codigoTipoQuarto),
        nomeTipo: model.nomeTipo,
        capacidadeMaxima: Number(model.capacidadeMaxima),
        valorDiaria: Number(model.valorDiaria),
      } as TipoQuarto;

      console.log(
        "[onSubmitForm] Dados a enviar:",
        JSON.stringify(toSend, null, 2)
      );

      await apiPutTipoQuarto(Number(codigoTipoQuarto), toSend);

      navigate(ROTA.TIPO_QUARTO.LISTAR, {
        state: {
          toast: {
            message: `Tipo de quarto ${codigoTipoQuarto} alterado com sucesso!`,
            type: "success",
          },
        },
      });
    } catch (error: any) {
      console.log(error);
      alert("Erro ao atualizar tipo de quarto");
    }
  };

  const onCancel = () => {
    navigate(ROTA.TIPO_QUARTO.LISTAR);
  };

  const getInputClass = () => {
    return "form-control app-label mt-2";
  };

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
            to={ROTA.TIPO_QUARTO.LISTAR}
            className="text-blue-600 hover:text-blue-700"
          >
            Tipos de Quarto
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Alterar</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-tools text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Alterar Tipo de Quarto
          </h1>
          <p className="text-xl">Edição de tipo de quarto</p>
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
                <label htmlFor={TIPO_QUARTO.FIELDS.CODIGO} className="appLabel">
                  Código do Tipo
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={TIPO_QUARTO.FIELDS.CODIGO}
                    name={TIPO_QUARTO.FIELDS.CODIGO}
                    type="number"
                    value={model?.codigoTipoQuarto ?? ""}
                    className={getInputClass()}
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(
                        TIPO_QUARTO.FIELDS.CODIGO as any,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(TIPO_QUARTO.FIELDS.CODIGO as any, e)
                    }
                  />
                  {showMensagem(TIPO_QUARTO.FIELDS.CODIGO as any)}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor={TIPO_QUARTO.FIELDS.NOME} className="appLabel">
                  {TIPO_QUARTO.LABEL.NOME}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={TIPO_QUARTO.FIELDS.NOME}
                    name={TIPO_QUARTO.FIELDS.NOME}
                    type="text"
                    value={model?.nomeTipo || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(
                        TIPO_QUARTO.FIELDS.NOME as any,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(TIPO_QUARTO.FIELDS.NOME as any, e)
                    }
                  />
                  {showMensagem(TIPO_QUARTO.FIELDS.NOME as any)}
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor={TIPO_QUARTO.FIELDS.CAPACIDADE}
                  className="appLabel"
                >
                  {TIPO_QUARTO.LABEL.CAPACIDADE}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={TIPO_QUARTO.FIELDS.CAPACIDADE}
                    name={TIPO_QUARTO.FIELDS.CAPACIDADE}
                    type="number"
                    value={model?.capacidadeMaxima ?? 2}
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(
                        TIPO_QUARTO.FIELDS.CAPACIDADE as any,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(TIPO_QUARTO.FIELDS.CAPACIDADE as any, e)
                    }
                  />
                  {showMensagem(TIPO_QUARTO.FIELDS.CAPACIDADE as any)}
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor={TIPO_QUARTO.FIELDS.VALOR_DIARIA}
                  className="appLabel"
                >
                  {TIPO_QUARTO.LABEL.VALOR_DIARIA}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={TIPO_QUARTO.FIELDS.VALOR_DIARIA}
                    name={TIPO_QUARTO.FIELDS.VALOR_DIARIA}
                    type="number"
                    step="0.01"
                    value={model?.valorDiaria ?? 0}
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(
                        TIPO_QUARTO.FIELDS.VALOR_DIARIA as any,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(TIPO_QUARTO.FIELDS.VALOR_DIARIA as any, e)
                    }
                  />
                  {showMensagem(TIPO_QUARTO.FIELDS.VALOR_DIARIA as any)}
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
