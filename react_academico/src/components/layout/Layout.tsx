import { Link, Outlet } from "react-router-dom";
import "./layout.css";
import { ROTA } from "../../services/router/url";

export default function Layout() {
  return (
    <div id="defaultLayout">
      <aside>
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
              <b>Lucas Novais de Oliveira - BI303268X</b>
            </span>

            {/* Link em vez de <a href> para evitar reload da página */}
            <Link to={ROTA.AUTH.LOGIN} className="btn btn-logout">
              Login
            </Link>

            {/* Logout só aparece depois do AuthContext, deixa para depois */}
            <a href="#" className="btn btn-logout">
              Logout
            </a>

          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
