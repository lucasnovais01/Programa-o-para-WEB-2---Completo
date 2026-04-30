import { FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useLogin } from "../../services/auth/hook/useLogin";

import { AUTH } from "../../services/auth/constants/auth.constants";

import { ROTA } from "../../services/router/url";

export default function Login() {
  const {
    model,
    errors,
    isLoading,
    handleChangeField,
    validateField,
    onSubmitForm,
    getInputClass,
  } = useLogin();

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Login</h2>
        
        {errors.geral && (
          <div className="alert alert-danger" role="alert">
            {errors.geral}
          </div>
        )}

        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="emailUsuario" className="app-label">
              {AUTH.LABEL.EMAIL}:
            </label>
            <input
              id="emailUsuario"
              name="emailUsuario"
              type="email"
              value={model.emailUsuario}
              className={getInputClass('emailUsuario')}
              autoComplete="off"
              onChange={(e) => handleChangeField('emailUsuario', e.target.value)}
              onBlur={(e) => validateField('emailUsuario', e.target.value)}
            />
            {errors?.emailUsuario && (
              <MensagemErro
                error={errors.emailUsuario}
                mensagem={errors.emailUsuarioMensagem}
              />
            )}
          </div>

          <div className="mb-2 mt-4">
            <label htmlFor="senhaUsuario" className="app-label">
              {AUTH.LABEL.SENHA}:
            </label>
            <input
              id="senhaUsuario"
              name="senhaUsuario"
              type="password"
              value={model.senhaUsuario}
              className={getInputClass('senhaUsuario')}
              autoComplete="off"
              onChange={(e) => handleChangeField('senhaUsuario', e.target.value)}
              onBlur={(e) => validateField('senhaUsuario', e.target.value)}
            />
            {errors?.senhaUsuario && (
              <MensagemErro
                error={errors.senhaUsuario}
                mensagem={errors.senhaUsuarioMensagem}
              />
            )}
          </div>

          <div className="mb-2 mt-4">

            {/* Ainda não foi feito esta rota

            <Link to={ROTA.RECUPERAR_SENHA.SOLICITAR} className="text-decoration-none">
              Esqueci minha senha
            </Link>

            */}

          </div>

          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Entrar"
              disabled={isLoading}
            >
              <span className="btn-icon">
                <i>
                  <FaSignInAlt />
                </i>
              </span>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-muted">
              Não tem uma conta?{" "}
              <Link to={ROTA.USUARIO.CRIAR}>Cadastre-se</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
