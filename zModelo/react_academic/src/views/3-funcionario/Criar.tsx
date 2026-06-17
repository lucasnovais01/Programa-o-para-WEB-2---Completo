/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

import "../../assets/css/7-form.css";
import { apiGetHospedes } from "../../services/1-hospede/api/api.hospede";
import { apiGetFuncoes } from "../../services/2-funcao/api/api.funcao";
import { apiPostFuncionario } from "../../services/3-funcionario/api/api.funcionario";
import { FUNCIONARIO } from "../../services/3-funcionario/constants/funcionario.constants";
import type { Funcionario } from "../../services/3-funcionario/type/funcionario";
import { ROTA } from "../../services/router/url";
import type { Hospede } from "../../type/1-hospede";
import type { Funcao } from "../../type/2-funcao";
import {
  createHandleChangeField,
  createShowMensagem,
  createValidateField,
} from "./zCamposCriar";

export default function CriarFuncionario() {
  const navigate = useNavigate();
  const [model, setModel] = useState<Funcionario>({
    idUsuario: 0,
    nomeLogin: "",
    senha: "",
    email: "",
    codigoFuncao: 0,
    dataContratacao: "",
    ativo: 1,
  } as Funcionario);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);

  const handleChangeField = createHandleChangeField(setModel, setErrors);
  const validateField = createValidateField(setErrors);
  const showMensagem = createShowMensagem(errors);

  useEffect(() => {
    async function loadData() {
      try {
        const resHospedes = await apiGetHospedes(1, 100);
        const dadosHospedes = resHospedes?.data?.dados;
        const hospedeList = Array.isArray(dadosHospedes)
          ? dadosHospedes
          : Array.isArray(dadosHospedes?.content)
          ? dadosHospedes.content
          : [];
        setHospedes(hospedeList);

        const resFuncoes = await apiGetFuncoes(1, 100);
        const dadosFuncoes = resFuncoes?.data?.dados;
        const funcaoList = Array.isArray(dadosFuncoes)
          ? dadosFuncoes
          : Array.isArray(dadosFuncoes?.content)
          ? dadosFuncoes.content
          : [];
        setFuncoes(funcaoList);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    loadData();
  }, []);

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!model) {
      alert("Dados incompletos para criação");
      return;
    }

    setLoading(true);

    try {
      const funcionarioToSend = {
        idUsuario: Number(model.idUsuario),
        nomeLogin: model.nomeLogin,
        senha: model.senha,
        email: model.email,
        codigoFuncao: model.codigoFuncao,
        dataContratacao: model.dataContratacao,
        ativo: Number(model.ativo),
      };

      console.log(
        "[onSubmitForm] Dados a enviar:",
        JSON.stringify(funcionarioToSend, null, 2)
      );

      await apiPostFuncionario(funcionarioToSend as unknown as Funcionario);

      navigate(ROTA.FUNCIONARIO.LISTAR, {
        state: {
          toast: {
            message: "Funcionário criado com sucesso!",
            type: "success",
          },
        },
      });
    } catch (error: any) {
      console.error("[onSubmitForm] Erro:", error);
      alert("Erro ao criar funcionário");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate(ROTA.FUNCIONARIO.LISTAR);
  };

  const getInputClass = () => {
    return "form-control app-label mt-2";
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
          <NavLink
            to={ROTA.FUNCIONARIO.LISTAR}
            className="text-blue-600 hover:text-blue-700"
          >
            Funcionários
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Novo Funcionário</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-user-plus text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {FUNCIONARIO.TITULO.CRIAR}
          </h1>
          <p className="text-xl">Transformar hóspede em funcionário</p>
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
                <label htmlFor={FUNCIONARIO.FIELDS.ID} className="appLabel">
                  Selecione o Hóspede
                </label>
                <div className="form-field-wrapper">
                  <select
                    id={FUNCIONARIO.FIELDS.ID}
                    name={FUNCIONARIO.FIELDS.ID}
                    value={model.idUsuario || 0}
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.ID,
                        Number(e.target.value)
                      )
                    }
                    onBlur={(e) => validateField(FUNCIONARIO.FIELDS.ID, e)}
                  >
                    <option value={0}>-- Selecione um hóspede --</option>
                    {hospedes.map((h) => (
                      <option key={h.idUsuario} value={h.idUsuario}>
                        {h.nomeHospede} (ID: {h.idUsuario})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor={FUNCIONARIO.FIELDS.NOME_LOGIN}
                  className="appLabel"
                >
                  {FUNCIONARIO.LABEL.NOME_LOGIN}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={FUNCIONARIO.FIELDS.NOME_LOGIN}
                    name={FUNCIONARIO.FIELDS.NOME_LOGIN}
                    type="text"
                    value={model.nomeLogin || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.NOME_LOGIN,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(FUNCIONARIO.FIELDS.NOME_LOGIN, e)
                    }
                  />
                  {showMensagem(FUNCIONARIO.FIELDS.NOME_LOGIN)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={FUNCIONARIO.FIELDS.SENHA} className="appLabel">
                  {FUNCIONARIO.LABEL.SENHA}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={FUNCIONARIO.FIELDS.SENHA}
                    name={FUNCIONARIO.FIELDS.SENHA}
                    type="password"
                    value={model.senha || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.SENHA,
                        e.target.value
                      )
                    }
                    onBlur={(e) => validateField(FUNCIONARIO.FIELDS.SENHA, e)}
                  />
                  {showMensagem(FUNCIONARIO.FIELDS.SENHA)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={FUNCIONARIO.FIELDS.EMAIL} className="appLabel">
                  {FUNCIONARIO.LABEL.EMAIL}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={FUNCIONARIO.FIELDS.EMAIL}
                    name={FUNCIONARIO.FIELDS.EMAIL}
                    type="email"
                    value={model.email || ""}
                    className={getInputClass()}
                    autoComplete="email"
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.EMAIL,
                        e.target.value
                      )
                    }
                    onBlur={(e) => validateField(FUNCIONARIO.FIELDS.EMAIL, e)}
                  />
                  {showMensagem(FUNCIONARIO.FIELDS.EMAIL)}
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor={FUNCIONARIO.FIELDS.CODIGO_FUNCAO}
                  className="appLabel"
                >
                  {FUNCIONARIO.LABEL.CODIGO_FUNCAO}
                </label>
                <div className="form-field-wrapper">
                  <select
                    id={FUNCIONARIO.FIELDS.CODIGO_FUNCAO}
                    name={FUNCIONARIO.FIELDS.CODIGO_FUNCAO}
                    value={model.codigoFuncao || ""}
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.CODIGO_FUNCAO,
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    onBlur={(e) =>
                      validateField(FUNCIONARIO.FIELDS.CODIGO_FUNCAO, e)
                    }
                  >
                    <option value={0}>-- Selecione uma função --</option>
                    {funcoes.map((f) => (
                      <option key={f.codigoFuncao} value={f.codigoFuncao}>
                        {f.nomeFuncao} ({f.codigoFuncao})
                      </option>
                    ))}
                  </select>
                  {showMensagem(FUNCIONARIO.FIELDS.CODIGO_FUNCAO)}
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor={FUNCIONARIO.FIELDS.DATA_CONTRATACAO}
                  className="appLabel"
                >
                  {FUNCIONARIO.LABEL.DATA_CONTRATACAO}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={FUNCIONARIO.FIELDS.DATA_CONTRATACAO}
                    name={FUNCIONARIO.FIELDS.DATA_CONTRATACAO}
                    type="date"
                    value={
                      typeof model.dataContratacao === "string"
                        ? model.dataContratacao
                        : ""
                    }
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(
                        FUNCIONARIO.FIELDS.DATA_CONTRATACAO,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(FUNCIONARIO.FIELDS.DATA_CONTRATACAO, e)
                    }
                  />
                  {showMensagem(FUNCIONARIO.FIELDS.DATA_CONTRATACAO)}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                id="submit"
                type="submit"
                disabled={loading}
                className="btn btn-sucess"
                title="Salvar"
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
                onClick={onCancel}
                className="btn btn-cancel"
                title="Cancelar"
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
