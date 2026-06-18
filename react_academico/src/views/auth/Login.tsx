import { FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useLogin } from "../../services/auth/hook/useLogin";

import { AUTH } from "../../services/auth/constants/auth.constants";

import { ROTA } from "../../services/router/url";

const handleGoogleLogin = () => {

  window.location.href = "http://localhost:8000/auth/google"

};

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
              Esqueceu sua senha{" "}
              <Link to={ROTA.RECUPERAR_SENHA.SOLICITAR} className="text-decoration-none">
                Esqueci minha senha
              </Link>
            </p>
          </div>

          <div className="mb-2 mt-4">
            {/* Ainda não foi feito esta rota
            <Link to={ROTA.RECUPERAR_SENHA.SOLICITAR} className="text-decoration-none">
              Esqueci minha senha
            </Link>
            */}
          </div>

          <div className="mt-3 text-center">
            <p className="text-muted">
              Não tem uma conta?{" "}
              <Link to={ROTA.USUARIO.CRIAR}>Cadastre-se</Link>
            </p>
          </div>


          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="btn-google"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '10px 16px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* SVG Vetorial do Google */}
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.7-.06-1.37-.17-2.02H12v3.84h6.23c-.27 1.44-1.1 2.65-2.35 3.47v2.9h3.8c2.24-2.06 3.52-5.07 3.52-8.99z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
{/* comentado/errado
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.7tímido07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
*/}
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Entrar com o Google
          </button>


        </form>
      </div>
    </div>
  );
}
