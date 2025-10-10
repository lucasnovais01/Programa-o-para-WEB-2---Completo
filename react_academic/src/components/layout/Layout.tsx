import type { ReactNode } from "react";

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div id="defaultLayout">{/* É assim que comenta em .tsx */}
      <aside>
        <a href="#">Dashboard</a>
        <a href="#">Usuário</a>
      </aside>
      <div className="content">
        <header>
          <div>Sistema Acadêmico</div>
          <div>
            Francisco
            <a href="#" className="btn-logout">
              Logout
            </a>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
