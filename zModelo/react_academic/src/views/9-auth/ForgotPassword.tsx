import { FaSignInAlt } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../assets/css/7-form.css";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useForgotPassword } from "../../services/9-auth/hook/useForgotPassword";
import { ROTA } from "../../services/router/url";

/**
 * ForgotPassword - Tela de recuperação de senha por e-mail.
 *
 * O usuário informa seu e-mail e o frontend chama o endpoint
 * `/auth/session/forgot` do backend para disparar o fluxo de reset.
 */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const {
    email,
    errors,
    isLoading,
    successMessage,
    handleChangeEmail,
    validateEmail,
    onSubmitForm,
    getInputClass,
  } = useForgotPassword();

  return (
    <div className="padraoPagina">
      <nav className="breadcrumb">
        <div className="container flex items-center space-x-2 text-sm">
          <NavLink to="/sistema/dashboard" className="text-blue-600 hover:text-blue-700">
            Home
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Recuperar senha</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-envelope text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">RECUPERAR SENHA</h1>
          <p className="text-xl">Informe o e-mail cadastrado para receber o link de recuperação.</p>
        </div>
      </section>

      <main className="container py-8">
        <div className="card animated fadeInDown" style={{ maxWidth: "600px", margin: "0 auto" }}>
          {errors.geral && (
            <div className="alert alert-danger" role="alert">
              {errors.geral}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          <form onSubmit={(e) => onSubmitForm(e)}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="emailUsuario" className="appLabel">
                  E-mail
                </label>
                <div className="form-field-wrapper">
                  <input
                    id="emailUsuario"
                    name="emailUsuario"
                    type="email"
                    value={email}
                    className={getInputClass()}
                    autoComplete="email"
                    onChange={(e) => handleChangeEmail(e.target.value)}
                    onBlur={(e) => validateEmail(e.target.value)}
                  />
                  {errors?.email && (
                    <MensagemErro error={errors.email} mensagem={errors.emailMensagem} />
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button id="submit" type="submit" className="btn btn-sucess" title="Enviar" disabled={isLoading}>
                <span className="btn-icon"><i><FaSignInAlt /></i></span>
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>

              <button id="cancel" type="button" onClick={() => navigate(ROTA.AUTH.LOGIN)} className="btn btn-cancel" title="Voltar para login">
                Voltar
              </button>
            </div>

            <div className="mt-3 text-center" style={{ marginTop: '2rem' }}>
              <p className="text-muted">
                Já tem uma conta? <Link to={ROTA.AUTH.LOGIN}>Faça login</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
