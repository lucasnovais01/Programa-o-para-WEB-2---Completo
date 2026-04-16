import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Input } from "../../components/input/Input";

import { USUARIO } from "../../services/usuario/constants/usuario.constants";
import { useCriar } from "../../services/usuario/hook/useCriar";

export default function CriarUsuario() {
  const { model, errors, handleChangeField, validateField, onSubmitForm } =
    useCriar();

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Novo Usuário</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4"></div>{" "}
          <Input
            label={USUARIO.LABEL.ID}
            id={USUARIO.FIELDS.ID}
            name={USUARIO.FIELDS.ID}
            value={model?.idUsuario}
            onChange={(e) =>
              handleChangeField(USUARIO.FIELDS.ID, e.target.value)
            }
            onBlur={(e) => validateField(USUARIO.FIELDS.ID, e)}
            error={errors.idUsuario}
            errorMensagem={errors.idUsuarioMensagem}
          />
          <div className="mb-2 mt-4">
            <Input
              label={USUARIO.LABEL.NOME}
              id={USUARIO.FIELDS.NOME}
              name={USUARIO.FIELDS.NOME}

              // Falta os campos Sobrenome, Email e Senha
              
              value={model?.nomeUsuario}
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.NOME, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.NOME, e)}
              error={errors.nomeUsuario}
              errorMensagem={errors.nomeUsuarioMensagem}
            />
          </div>
          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Cadastrar um novo usuário"
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
