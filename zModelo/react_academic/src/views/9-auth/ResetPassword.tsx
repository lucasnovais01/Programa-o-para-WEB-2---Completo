import { useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../assets/css/7-form.css";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useResetPassword } from "../../services/9-auth/hook/useResetPassword";
import { ROTA } from "../../services/router/url";

/**
 * ResetPassword - Tela de redefinição de senha a partir do token enviado por e-mail.
 *
 * O backend envia um link com `?token=...` e o formulário faz POST em
 * `/auth/session/reset` com o token e a nova senha.
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const {
    token,
    senha,
    confirmaSenha,
    errors,
    successMessage,
    isLoading,
    setSenha,
    setConfirmaSenha,
    validateField,
    onSubmitForm,
    getInputClass,
  } = useResetPassword();

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => navigate(ROTA.AUTH.LOGIN), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, navigate]);

  return (
    <div className="padraoPagina">
      <nav className="breadcrumb">
        <div className="container flex items-center space-x-2 text-sm">
          <NavLink to="/sistema/dashboard" className="text-blue-600 hover:text-blue-700">
            Home
          </NavLink>
          <i className="fas fa-chevron-right text-gray-400"></i>
          <span className="text-gray-600">Redefinir senha</span>
        </div>
      </nav>

      <section className="devtools-banner">
        <div className="container text-center">
          <i className="fas fa-lock text-6xl mb-4"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">REDEFINIR SENHA</h1>
          <p className="text-xl">Defina uma nova senha para a sua conta.</p>
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
            <>
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
              <div className="text-center mb-3">
                <button className="btn btn-primary" onClick={() => navigate(ROTA.AUTH.LOGIN)}>
                  Ir para login
                </button>
              </div>
            </>
          )}

          <form onSubmit={(e) => onSubmitForm(e)}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="senhaUsuario" className="appLabel">
                  Nova senha
                </label>
                <div className="form-field-wrapper">
                  <input
                    id="senhaUsuario"
                    name="senhaUsuario"
                    type="password"
                    value={senha}
                    className={getInputClass('senha')}
                    autoComplete="new-password"
                    onChange={(e) => setSenha(e.target.value)}
                    onBlur={(e) => validateField('senha', e.target.value)}
                  />
                  {errors?.senha && (
                    <MensagemErro error={errors.senha} mensagem={errors.senhaMensagem} />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmaSenhaUsuario" className="appLabel">
                  Confirmar senha
                </label>
                <div className="form-field-wrapper">
                  <input
                    id="confirmaSenhaUsuario"
                    name="confirmaSenhaUsuario"
                    type="password"
                    value={confirmaSenha}
                    className={getInputClass('confirmaSenha')}
                    autoComplete="new-password"
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                    onBlur={(e) => validateField('confirmaSenha', e.target.value)}
                  />
                  {errors?.confirmaSenha && (
                    <MensagemErro error={errors.confirmaSenha} mensagem={errors.confirmaSenhaMensagem} />
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button id="submit" type="submit" className="btn btn-sucess" title="Redefinir senha" disabled={isLoading}>
                <span className="btn-icon"><i><FaSignInAlt /></i></span>
                {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
              </button>

              <button id="cancel" type="button" onClick={() => navigate(ROTA.AUTH.LOGIN)} className="btn btn-cancel" title="Voltar para login">
                Voltar
              </button>
            </div>

            <div className="mt-3 text-center" style={{ marginTop: '2rem' }}>
              <p className="text-muted">Token: {token ? 'recebido' : 'não encontrado'}</p>
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
