import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import MensagemErro from "../../components/mensagem/MensagemErro";

import { USUARIO } from "../../services/usuario/constants/usuario.constants";
import { useAlterar } from "../../services/usuario/hook/useAlterar";

export default function AlterarUsuario() {
  const {
    model,
    errors,
    handleChangeField,
    validateField,
    onSubmitForm,
    handleCancel,
    getInputClass,
  } = useAlterar();

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Alterar Usuário</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="idUsuario" className="app-label">
              {USUARIO.LABEL.ID}:
            </label>
            <input
              id={USUARIO.FIELDS.ID}
              name={USUARIO.FIELDS.ID}

              // Falta os campos Sobrenome, Email e Senha

              value={model?.idUsuario}
              className={getInputClass(USUARIO.FIELDS.ID)}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.ID, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.ID, e)}
            />
            {errors?.idUsuario && (
              <MensagemErro
                error={errors.idUsuario}
                mensagem={errors.idUsuarioMensagem}
              />
            )}
          </div>
          <div className="mb-2 mt-4">
            <label htmlFor="nomeUsuario" className="app-label">
              {USUARIO.LABEL.NOME}:
            </label>
            <input
              id={USUARIO.FIELDS.NOME}
              name={USUARIO.FIELDS.NOME}
              value={model?.nomeUsuario}
              className={getInputClass(USUARIO.FIELDS.NOME)}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.NOME, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.NOME, e)}
            />
            {errors?.nomeUsuario && (
              <MensagemErro
                error={errors.nomeUsuario}
                mensagem={errors.nomeUsuarioMensagem}
              />
            )}
          </div>
          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Cadastrar um novousuário"
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
              title="Cancelar o Cadastro do usuário"
              onClick={handleCancel}
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
    </div>
  );
}
