import type { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import './Layout.css';

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div id="defaultLayout">{/* É assim que comenta em .tsx */}
      <aside>
        <Link to="/sistema/dashboard">Dashboard</Link>
        <Link to="/sistema/cidade/listar">Cidade</Link>

      </aside>
      <div className="content">
        <header>
          <div className="system-title">
            <b>Sistema Acadêmico</b>
          </div>
          
          <div className="user-info">
            <span className="username">
              <b>Francisco</b>
            </span>
            
            <a href="#" className="btn-logout">
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
