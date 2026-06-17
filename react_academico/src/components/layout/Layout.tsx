import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../services/auth/hook/useAuth";
import { ROTA } from "../../services/router/url";
import "./layout.css";

export default function Layout() {
  const { isAuthenticated, usuario, logout } = useAuth();

  return (
    <div id="defaultLayout">
      <aside>
        <div className="sidebar-title">
          <b>Lucas Novais de Oliveira - BI303268X</b>
        </div>
        <Link to="/sistema/dashboard">Dashboard</Link>
        <Link to="/sistema/cidade/listar">Cidade</Link>
        <Link to="/sistema/usuario/listar">Usuário</Link>
      </aside>
      <div className="content">
        <header>
          <div className="system-title">
            <b>Sistema Acadêmico</b>
          </div>
          <div className="user-info">
            <span className="username">
              <b>
                {isAuthenticated && usuario
                  ? `${usuario.nomeUsuario} ${usuario.sobrenomeUsuario}`
                  : "Visitante"}
              </b>
            </span>

            {isAuthenticated ? (
              <button onClick={logout} className="btn btn-logout">
                Logout
              </button>
            ) : (
              <Link to={ROTA.AUTH.LOGIN} className="btn btn-logout">
                Login
              </Link>
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
