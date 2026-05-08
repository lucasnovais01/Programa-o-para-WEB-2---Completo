import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import MensagemErro from "../../components/mensagem/MensagemErro";

import React from "react";
import { useResources } from "../../services/providers/ResourcesProviders";
import { ROTA } from "../../services/router/url";
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
  
  const id=1;
  const { getEndpoint } = useResources();
    // hook Memo() => mantém na memória 
    // o valor || função carregada, evitando 
    // repetição.  
    let url = React.useMemo(() => {
      const urlUsuario = getEndpoint('usuario', id);
      return urlUsuario;
    }, []);
  
    if (!url) {
      console.error('recurso inexistente');
      return;
    }

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Alterar Usuário</h2>
        <form onSubmit={(e) => onSubmitForm(e, ROTA.USUARIO.ATUALIZAR)}>
          <div className="mb-2 mt-4">
            <label htmlFor="idUsuario" className="app-label">
              {USUARIO.LABEL.ID}:
            </label>
            <input
              id={USUARIO.FIELDS.ID}
              name={USUARIO.FIELDS.ID}
              value={model?.idUsuario}
              className={getInputClass(USUARIO.FIELDS.ID)}
              readOnly={true}
              disabled={true}
              autoComplete="off"
            />
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
          <div className="mb-2 mt-4">
            <label htmlFor="sobrenomeUsuario" className="app-label">
              {USUARIO.LABEL.SOBRENOME}:
            </label>
            <input
              id={USUARIO.FIELDS.SOBRENOME}
              name={USUARIO.FIELDS.SOBRENOME}
              value={model?.sobrenomeUsuario}
              className={getInputClass(USUARIO.FIELDS.SOBRENOME)}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.SOBRENOME, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.SOBRENOME, e)}
            />
            {errors?.sobrenomeUsuario && (
              <MensagemErro
                error={errors.sobrenomeUsuario}
                mensagem={errors.sobrenomeUsuarioMensagem}
              />
            )}
          </div>
          <div className="mb-2 mt-4">
            <label htmlFor="emailUsuario" className="app-label">
              {USUARIO.LABEL.EMAIL}:
            </label>
            <input
              id={USUARIO.FIELDS.EMAIL}
              name={USUARIO.FIELDS.EMAIL}
              value={model?.emailUsuario}
              className={getInputClass(USUARIO.FIELDS.EMAIL)}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.EMAIL, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.EMAIL, e)}
            />
            {errors?.emailUsuario && (
              <MensagemErro
                error={errors.emailUsuario}
                mensagem={errors.emailUsuarioMensagem}
              />
            )}
          </div>
          {/* Vou deixar comentado a parte de alteração de senha pelo botão Alterar */}
          {/* 
          <div className="mb-2 mt-4">
            <label htmlFor="senhaUsuario" className="app-label">
              {USUARIO.LABEL.SENHA}:
            </label>
            <input
              id={USUARIO.FIELDS.SENHA}
              name={USUARIO.FIELDS.SENHA}
              value={model?.senhaUsuario}
              className={getInputClass(USUARIO.FIELDS.SENHA)}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.SENHA, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.SENHA, e)}
            />
            {errors?.senhaUsuario && (
              <MensagemErro
                error={errors.senhaUsuario}
                mensagem={errors.senhaUsuarioMensagem}
              />
            )}
          </div>
          */}

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
