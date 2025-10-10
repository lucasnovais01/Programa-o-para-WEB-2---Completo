import type { ReactNode } from "react";
import "layout.css";

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps) {

  return (          
    <div id="defaultLayout"> {/* É assim que comenta em .tsx */}
      <aside>
        <a href='#'>DashBoard</a>
        <a href='#'>Usuário</a>
      </aside>
      <div className="content"> {/*  */}
        <header>
          <div>Sistema Acadêmico</div> 
          <div>
            Francisco
            <a href='#' className="btn-logout">
              Logout
            </a>
          </div>
        </header>
        <main>
          { children }          
        </main>

        <h1>Conteúdo dinâmico</h1>
      </div>
    </div>
  );
}
