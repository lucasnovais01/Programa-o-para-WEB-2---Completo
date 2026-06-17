import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/9-auth/hook/useAuth";
import { ROTA } from "../../services/router/url";
// Vantagem: O NavLink adiciona a classe active automaticamente.

export default function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, funcionario, logout } = useAuth();

  const handleLoginClick = () => {
    navigate(ROTA.AUTH.LOGIN);
  };

  return (
    <>
      {/* HEADER FIXO */}
      <header className="header">
        <div className="container">
          
          {/* Link para Dashboard (Home) */}
          <NavLink
            to={ROTA.DASHBOARD}
            className="logo"
          >
            <i className="fas fa-hotel"></i>
            <span>Hotel Cocao</span>
          </NavLink>

          {/* Link para DevTools */}
          <NavLink
            to="/sistema/devtools"
            className="nav-btn"
          >
            <i className="fas fa-tools"></i>
            <span>DevTools</span>
          </NavLink>

          {/* Área de usuário: mostra o nome (apenas quando autenticado)
              e o botão (Login ou Sair). Se não autenticado, o nome não aparece. */}
          <div className="user-area">
            {isAuthenticated && (
              <>
                <span className="user-name">{funcionario ? funcionario.nomeLogin : ''}</span>
                <button
                  type="button"
                  className="user-key-btn"
                  onClick={() => navigate(ROTA.AUTH.RESET)}
                  title="Redefinir senha"
                  aria-label="Redefinir senha"
                  style={{ marginLeft: 8 }}
                >
                  <i className="fas fa-key"></i>
                </button>
              </>
            )}

            {isAuthenticated ? (
              <button className="login-btn" onClick={logout} title="Sair">
                <i className="fas fa-sign-out-alt"></i> <span>Sair</span>
              </button>
            ) : (
              <button className="login-btn" onClick={handleLoginClick} title="Entrar">
                <i className="fas fa-sign-in-alt"></i> <span>Login</span>
              </button>
            )}
          </div>
        </div>

      {/* Link para hospede/Listar.view no cabeçalho (header), comentado pra referência e aprendizado
        to="/sistema/hospede/listar"
        className="nav-btn"
      >
        <i className="fas fa-search"></i>
        <span>Listar</span>
      </NavLink>
      */}

      </header>




      {/* CONTEÚDO (espaço, abaixo do header) */}
      <div className="page-content">
        <Outlet />

      </div>




      {/* FOOTER, simples */}
      <footer className="footer">
        <div className="container">

          <NavLink to={ROTA.DASHBOARD} className="footer-logo">
            <i className="fas fa-hotel"></i> <span>Hotel Cocao</span>
          </NavLink>

          <p className="footer-description">Conforto e elegância para sua estadia perfeita.</p>

          <div className="footer-section">
            <h3>Contatos</h3>
            <p><i className="fas fa-phone"></i> (18) 99999-9999</p>
            <p><i className="fas fa-envelope"></i> contato@hotelcocao.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Rua Pedro Cavalo, 709 - Residencial Portal da Pérola II, Birigui - SP, 16201-407</p>
          </div>

          <div className="footer-section">
            <h3>Links Úteis</h3>
            <NavLink 
              to="/sistema/dashboard"
              className={({ isActive }) => 
                isActive ? "text-blue-700" : "text-blue-600 hover:text-blue-700"
              }
            >
              Home
            </NavLink>
            <a href="#">Política de Privacidade</a>
            <a href="#">Termos de Uso</a>
            <a href="#">FAQ</a>
            <a href="#">Suporte</a>
          </div>

          <div className="footer-section">
            <h3>Redes Sociais</h3>
            <div className="social-links">
              <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <p>© 2025 Hotel Cocao. Todos os direitos reservados.</p>
          <br></br>
          <p>Trabalho de escola ppw2 - IFSP - Campus Birigui</p>
        </div>
      </footer>
    </>
  );
}