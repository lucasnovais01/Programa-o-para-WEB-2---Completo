import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { NavLink } from "react-router-dom";

import "../../assets/css/7-form.css";
import { HOSPEDE } from "../../services/1-hospede/constants/hospede.constants";
import { useCriar } from "../../services/1-hospede/hook/useCriar";
import { ROTA } from "../../services/router/url";

export default function CriarHospede() {
  const {
    model,
    loading,
    handleChangeField,
    validateField,
    showMensagem,
    getInputClass,
    onSubmitForm,
    onCancel,
  } = useCriar();

  // ============================================================
  // RENDERIZAÇÃO DO FORMULÁRIO
  // ============================================================
  return (
    <div className="padraoPagina">
      {/* Breadcrumb: Home > Hóspedes > Criar */}
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
          <span className="text-gray-600">Novo Hóspede</span>
        </div>
      </nav>

      {/* Banner - Criar novo hóspede */}
      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-user-plus text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {HOSPEDE.TITULO.CRIAR}
          </h1>
          <p className="text-xl">Adicione um novo hóspede ao sistema</p>
        </div>
      </section>

      {/* Content */}
      <main className="container py-8">
        <div
          className="card animated fadeInDown"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <form onSubmit={onSubmitForm}>
            <div className="form-grid">
              {/* ============================================================
              Campos do formulário baseados na tabela COCAO_HOSPEDE
              ============================================================ */}

              {/* Campo: Nome Completo */}
              <div className="form-group">
                <label htmlFor={HOSPEDE.FIELDS.NOME} className="appLabel">
                  {HOSPEDE.LABEL.NOME}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={HOSPEDE.FIELDS.NOME}
                    name={HOSPEDE.FIELDS.NOME}
                    type="text"
                    value={model.nomeHospede || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(HOSPEDE.FIELDS.NOME, e.target.value)
                    }
                    onBlur={(e) => validateField(HOSPEDE.FIELDS.NOME, e)}
                  />
                  {showMensagem(HOSPEDE.FIELDS.NOME)}
                </div>
              </div>

              {/* Campo: CPF */}
              <div className="form-group">
                <label htmlFor={HOSPEDE.FIELDS.CPF} className="appLabel">
                  {HOSPEDE.LABEL.CPF}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={HOSPEDE.FIELDS.CPF}
                    name={HOSPEDE.FIELDS.CPF}
                    type="text"
                    value={model.cpf || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    maxLength={11}
                    onChange={(e) =>
                      handleChangeField(HOSPEDE.FIELDS.CPF, e.target.value)
                    }
                    onBlur={(e) => validateField(HOSPEDE.FIELDS.CPF, e)}
                  />
                  {showMensagem(HOSPEDE.FIELDS.CPF)}
                </div>
              </div>

              {/* Campo: RG */}
              <div className="form-group">
                <label htmlFor={HOSPEDE.FIELDS.RG} className="appLabel">
                  {HOSPEDE.LABEL.RG}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={HOSPEDE.FIELDS.RG}
                    name={HOSPEDE.FIELDS.RG}
                    type="text"
                    value={model.rg || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    maxLength={20}
                    onChange={(e) =>
                      handleChangeField(HOSPEDE.FIELDS.RG, e.target.value)
                    }
                    onBlur={(e) => validateField(HOSPEDE.FIELDS.RG, e)}
                  />
                  {showMensagem(HOSPEDE.FIELDS.RG)}
                </div>
              </div>

              {/* Campo: Sexo */}
              <div className="form-group">
                <label htmlFor={HOSPEDE.FIELDS.SEXO} className="appLabel">
                  {HOSPEDE.LABEL.SEXO}
                </label>
                <div className="form-field-wrapper">
                  <select
                    id={HOSPEDE.FIELDS.SEXO}
                    name={HOSPEDE.FIELDS.SEXO}
                    value={model.sexo || ""}
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(HOSPEDE.FIELDS.SEXO, e.target.value)
                    }
                    onBlur={(e) => validateField(HOSPEDE.FIELDS.SEXO, e)}
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                  {showMensagem(HOSPEDE.FIELDS.SEXO)}
                </div>
              </div>

              {/* Campo: Data de Nascimento */}
              <div className="form-group">
                <label
                  htmlFor={HOSPEDE.FIELDS.DATA_NASCIMENTO}
                  className="appLabel"
                >
                  {HOSPEDE.LABEL.DATA_NASCIMENTO}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={HOSPEDE.FIELDS.DATA_NASCIMENTO}
                    name={HOSPEDE.FIELDS.DATA_NASCIMENTO}
                    type="date"
                    value={
                      model.dataNascimento
                        ? new Date(model.dataNascimento)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(
                        HOSPEDE.FIELDS.DATA_NASCIMENTO,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateField(HOSPEDE.FIELDS.DATA_NASCIMENTO, e)
                    }
                  />
                  {showMensagem(HOSPEDE.FIELDS.DATA_NASCIMENTO)}
                </div>
              </div>

              {/* Campo: E-mail */}
              <div className="form-group">
                <label htmlFor={HOSPEDE.FIELDS.EMAIL} className="appLabel">
                  {HOSPEDE.LABEL.EMAIL}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={HOSPEDE.FIELDS.EMAIL}
                    name={HOSPEDE.FIELDS.EMAIL}
                    type="email"
                    value={model.email || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(HOSPEDE.FIELDS.EMAIL, e.target.value)
                    }
                    onBlur={(e) => validateField(HOSPEDE.FIELDS.EMAIL, e)}
                  />
                  {showMensagem(HOSPEDE.FIELDS.EMAIL)}
                </div>
              </div>

              {/* Campo: Telefone */}
              <div className="form-group">
                <label htmlFor={HOSPEDE.FIELDS.TELEFONE} className="appLabel">
                  {HOSPEDE.LABEL.TELEFONE}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id={HOSPEDE.FIELDS.TELEFONE}
                    name={HOSPEDE.FIELDS.TELEFONE}
                    type="tel"
                    value={model.telefone || ""}
                    className={getInputClass()}
                    autoComplete="off"
                    onChange={(e) =>
                      handleChangeField(HOSPEDE.FIELDS.TELEFONE, e.target.value)
                    }
                    onBlur={(e) => validateField(HOSPEDE.FIELDS.TELEFONE, e)}
                  />
                  {showMensagem(HOSPEDE.FIELDS.TELEFONE)}
                </div>
              </div>

              {/* Campo: Tipo */}
              <div className="form-group">
                <label htmlFor={HOSPEDE.FIELDS.TIPO} className="appLabel">
                  {HOSPEDE.LABEL.TIPO}
                </label>
                <div className="form-field-wrapper">
                  <select
                    id={HOSPEDE.FIELDS.TIPO}
                    name={HOSPEDE.FIELDS.TIPO}
                    value={model.tipo || 0}
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(HOSPEDE.FIELDS.TIPO, e.target.value)
                    }
                    onBlur={(e) => validateField(HOSPEDE.FIELDS.TIPO, e)}
                  >
                    <option value={0}>Hóspede</option>
                    <option value={1}>Funcionário</option>
                  </select>
                  {showMensagem(HOSPEDE.FIELDS.TIPO)}
                </div>
              </div>

              {/* Campo: Ativo - Por enquanto desabilitado na criação */}
              {/*


              <div className="form-group">
                <label htmlFor={HOSPEDE.FIELDS.ATIVO} className="appLabel">
                  {HOSPEDE.LABEL.ATIVO}
                </label>
                <div className="form-field-wrapper">
                  <select
                    id={HOSPEDE.FIELDS.ATIVO}
                    name={HOSPEDE.FIELDS.ATIVO}
                    value={model.ativo || 1}
                    className={getInputClass()}
                    onChange={(e) =>
                      handleChangeField(HOSPEDE.FIELDS.ATIVO, e.target.value)
                    }
                    onBlur={(e) => validateField(HOSPEDE.FIELDS.ATIVO, e)}
                  >
                    <option value={1}>Sim</option>
                    <option value={0}>Não</option>
                  </select>
                  {showMensagem(HOSPEDE.FIELDS.ATIVO)}
                </div>
              </div>
              */}
            </div>

            {/* Botões de Ação */}
            <div className="form-actions">
              <button
                id="submit"
                type="submit"
                className="btn btn-sucess"
                title={HOSPEDE.OPERACAO.CRIAR.ACAO}
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
                title="Cancelar criação"
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
