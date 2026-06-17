import { FaSignInAlt } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useLogin } from "../../services/9-auth/hook/useLogin";

import { AUTH } from "../../services/9-auth/constants/auth.constants";

import { ROTA } from "../../services/router/url";

import "../../assets/css/7-form.css";

/**
 * Login - Tela de autenticação do usuário.
 *
 * Ajustes visuais implementados:
 * - Usa o mesmo layout de formulário do componente AlterarFuncionario
 * - Exibe um card centralizado com breadcrumb + banner
 * - Mantém a lógica de validação e o hook useLogin
 * - Botões: Entrar + Cancelar
 * - Link de cadastro abaixo do formulário
 * - Texto adicional "Esqueceu sua conta? Clique aqui" como placeholder
 */
export default function Login() {
  const navigate = useNavigate();
  const {
    model,
    errors,
    isLoading,
    handleChangeField,
    validateField,
    onSubmitForm,
    getInputClass,
  } = useLogin();

  const onCancel = () => {
    navigate(ROTA.DASHBOARD);
  };

  return (
    <div className="padraoPagina">
      <nav className="breadcrumb">
        <div className="container flex items-center space-x-2 text-sm">
          <NavLink to="/sistema/dashboard" className="text-blue-600 hover:text-blue-700">
            Home
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Login</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-sign-in-alt text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">LOGIN</h1>
          <p className="text-xl">Entre com sua conta</p>
        </div>
      </section>

      <main className="container py-8">
        <div className="card animated fadeInDown" style={{ maxWidth: "600px", margin: "0 auto" }}>
          {errors.geral && (
            <div className="alert alert-danger" role="alert">
              {errors.geral}
            </div>
          )}

          <form onSubmit={(e) => onSubmitForm(e)}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="loginUsuario" className="appLabel">
                  {AUTH.LABEL.LOGIN}
                </label>
                <div className="form-field-wrapper">
                  <input
                    id="loginUsuario"
                    name="loginUsuario"
                    type="text"
                    value={model.loginUsuario}
                    className={getInputClass('loginUsuario')}
                    autoComplete="off"
                    onChange={(e) => handleChangeField('loginUsuario', e.target.value)}
                    onBlur={(e) => validateField('loginUsuario', e.target.value)}
                  />
                  {errors?.loginUsuario && (
                    <MensagemErro error={errors.loginUsuario} mensagem={errors.loginUsuarioMensagem} />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="senhaUsuario" className="appLabel">
                  {AUTH.LABEL.SENHA}
                </label>
                <div className="form-field-wrapper">
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
                    <MensagemErro error={errors.senhaUsuario} mensagem={errors.senhaUsuarioMensagem} />
                  )}
                </div>
              </div>

            </div>

            <div className="form-actions">
              <button id="submit" type="submit" className="btn btn-sucess" title="Entrar" disabled={isLoading}>
                <span className="btn-icon"><i><FaSignInAlt /></i></span>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>

              <button id="cancel" type="button" onClick={onCancel} className="btn btn-cancel" title="Cancelar">
                Cancelar
              </button>
            </div>

            <div className="mt-3 text-center" style={{ marginTop: '2rem' }}>
              <p className="text-muted">
                Não tem uma conta? <Link to={ROTA.FUNCIONARIO.CRIAR}>Cadastre-se</Link>
              </p>
              <p className="text-muted" style={{ marginTop: '1.0rem' }}>
                Esqueceu sua conta? <Link to={ROTA.AUTH.FORGOT}>Clique aqui</Link>
              </p>

              {/* Botão adicional para abrir diretamente a tela de redefinição (sem token) */}
              <div style={{ marginTop: '1.0rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(ROTA.AUTH.RESET)}
                  style={{ marginTop: '1.0rem' }}
                >
                  Abrir tela de redefinição
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
