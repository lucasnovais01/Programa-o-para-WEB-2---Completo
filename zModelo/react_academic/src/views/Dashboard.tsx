import { useState } from "react"; // para controlar a visibilidade do tooltip
import { Link } from "react-router-dom";
import { ROTA } from "../services/router/url";

export default function Dashboard() {
  const [showTooltip, setShowTooltip] = useState(false); // para controlar a visibilidade do tooltip

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h1>Dashboard</h1>
        <p>Bem-vindo ao sistema de hotel</p>

        {/* Grid com opções CRUD para Hóspede */}
        <div className="crud-container">
          <h2>Gerenciamento de Hóspedes</h2>

          <div className="crud-grid">
            {/* Botão Listar */}
            <Link to={ROTA.HOSPEDE.LISTAR} className="crud-btn crud-listar">
              <i className="fas fa-list"></i>
              <span>Listar</span>
            </Link>

            {/* Botão Buscar (Consultar) */}
            <Link
              to={ROTA.HOSPEDE.POR_ID + "/1"}
              className="crud-btn crud-buscar"
            >
              <i className="fas fa-search"></i>
              <span>Buscar</span>
            </Link>

            {/* Botão Criar */}
            <Link to={ROTA.HOSPEDE.CRIAR} className="crud-btn crud-criar">
              <i className="fas fa-plus"></i>
              <span>Criar</span>
            </Link>

            {/* Botão Alterar */}
            <Link
              to={ROTA.HOSPEDE.ATUALIZAR + "/1"}
              className="crud-btn crud-atualizar"
            >
              <i className="fas fa-edit"></i>
              <span>Alterar</span>
            </Link>

            {/* Botão Excluir */}
            <Link
              to={ROTA.HOSPEDE.EXCLUIR + "/1"}
              className="crud-btn crud-excluir"
            >
              <i className="fas fa-trash"></i>
              <span>Excluir</span>
            </Link>
          </div>
        </div>

        {/* Grid com opções CRUD para FUNCAO */}
        <div className="crud-container">
          <h2>Função</h2>

          <div className="crud-grid">
            {/* Botão Listar */}
            <Link to={ROTA.FUNCAO.LISTAR} className="crud-btn crud-listar">
              <i className="fas fa-list"></i>
              <span>Listar</span>
            </Link>

            {/* Botão Buscar (Consultar) */}
            <Link
              to={ROTA.FUNCAO.POR_ID + "/1"}
              className="crud-btn crud-buscar"
            >
              <i className="fas fa-search"></i>
              <span>Buscar</span>
            </Link>

            {/* Botão Criar */}
            <Link to={ROTA.FUNCAO.CRIAR} className="crud-btn crud-criar">
              <i className="fas fa-plus"></i>
              <span>Criar</span>
            </Link>

            {/* Botão Alterar */}
            <Link
              to={ROTA.FUNCAO.ATUALIZAR + "/1"}
              className="crud-btn crud-atualizar"
            >
              <i className="fas fa-edit"></i>
              <span>Alterar</span>
            </Link>

            {/* Botão Excluir */}
            <Link
              to={ROTA.FUNCAO.EXCLUIR + "/1"}
              className="crud-btn crud-excluir"
            >
              <i className="fas fa-trash"></i>
              <span>Excluir</span>
            </Link>
          </div>
        </div>

{/*
1. O REMOVE realmente é um PUT disfarçado de DELETE
"No backend, o código do serviço de remoção de funcionário é este (funcionario.service.remove.ts)""

Frontend: Excluir.tsx (linhas 14-45)
Backend Controller: funcionario.controller.remove.ts
Backend Service: funcionario.service.remove.ts

2. Como funciona de verdade:
O delete LITERALMENTE DELETA do banco (await this.funcionarioRepository.delete({ idUsuario: id })), MAS:

Trigger T19 (COCAO_HOTEL_V12.sql linhas 1379-1407) só atua em INSERT ou UPDATE de COCAO_FUNCIONARIO
Quando um registro é deletado de COCAO_FUNCIONARIO, ele desaparece completamente
Mas o registro em COCAO_HOSPEDE fica intacto (porque é uma tabela separada)
Com TIPO = 0 (volta a ser hóspede comum)
3. Por que o POST não dá problema?
O POST funciona porque:

O POST cria um novo registro em COCAO_FUNCIONARIO
Trigger T19 é disparada (BEFORE INSERT)
Trigger faz UPDATE em COCAO_HOSPEDE setando TIPO = 1
Tudo acontece automaticamente, sem validações conflitantes
O POST não dá problema porque não há constraint ou lógica que impeça você de ter o mesmo idUsuario em ambas as tabelas. A trigger simplesmente muda o TIPO quando um POST é executado.

*/}








        {/* Grid com opções CRUD para FUNCIONARIO */}
        <div className="crud-container">
          <h2>
            Funcionário

            {/* Ícone de informação com tooltip explicativo */}
            <span
              style={{
                cursor: "pointer",
                marginLeft: "10px",
                position: "relative",
                display: "inline-block",
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <i
                className="fas fa-question-circle"
                style={{ color: "#007bff", fontSize: "18px" }}
              ></i>
              {showTooltip && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "-80px",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding: "10px 15px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                    fontSize: "12px",
                    zIndex: 1000,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    pointerEvents: "none",
                  }}
                >
                  <p>Funcionário é filho da superclasse <strong>Hóspede</strong>.</p>

                  <p><strong>REMOVE</strong> não apaga o registro em <code>COCAO_HOSPEDE</code>.  
                  O <strong>DELETE</strong> remove apenas de <code>COCAO_FUNCIONARIO</code>, preservando o hóspede.</p>

                  <p>Após o DELETE, a pessoa volta a ser <strong>TIPO = 0</strong> (hóspede comum).</p>

                  <p>Não há <strong>PUT</strong>. O backend usa DELETE puro no NestJS.</p>

                  <p>No <strong>POST (CREATE)</strong>, a trigger <code>T19</code> ajusta automaticamente  
                  <code>COCAO_HOSPEDE.TIPO = 1</code> ao inserir em <code>COCAO_FUNCIONARIO</code>.</p>
                </div>
              )}
            </span>
          </h2>

          <div className="crud-grid">
            {/* Botão Listar */}
            <Link to={ROTA.FUNCIONARIO.LISTAR} className="crud-btn crud-listar">
              <i className="fas fa-list"></i>
              <span>Listar</span>
            </Link>

            {/* Botão Buscar (Consultar) */}
            <Link
              to={ROTA.FUNCIONARIO.POR_ID + "/1"}
              className="crud-btn crud-buscar"
            >
              <i className="fas fa-search"></i>
              <span>Buscar</span>
            </Link>

            {/* Botão Criar */}
            <Link to={ROTA.FUNCIONARIO.CRIAR} className="crud-btn crud-criar">
              <i className="fas fa-plus"></i>
              <span>Criar</span>
            </Link>

            {/* Botão Alterar */}
            <Link
              to={ROTA.FUNCIONARIO.ATUALIZAR + "/1"}
              className="crud-btn crud-atualizar"
            >
              <i className="fas fa-edit"></i>
              <span>Alterar</span>
            </Link>

            {/* Botão Excluir */}
            <Link
              to={ROTA.FUNCIONARIO.EXCLUIR + "/1"}
              className="crud-btn crud-excluir"
            >
              <i className="fas fa-trash"></i>
              <span>Excluir</span>
            </Link>
          </div>
        </div>

        {/* Grid com opções CRUD para TIPO DE QUARTO */}
        <div className="crud-container">
          <h2>Tipo de Quarto</h2>

          <div className="crud-grid">
            {/* Botão Listar */}
            <Link to={ROTA.TIPO_QUARTO.LISTAR} className="crud-btn crud-listar">
              <i className="fas fa-list"></i>
              <span>Listar</span>
            </Link>

            {/* Botão Buscar (Consultar) */}
            <Link
              to={ROTA.TIPO_QUARTO.POR_ID + "/1"}
              className="crud-btn crud-buscar"
            >
              <i className="fas fa-search"></i>
              <span>Buscar</span>
            </Link>

            {/* Botão Criar */}
            <Link to={ROTA.TIPO_QUARTO.CRIAR} className="crud-btn crud-criar">
              <i className="fas fa-plus"></i>
              <span>Criar</span>
            </Link>

            {/* Botão Alterar */}
            <Link
              to={ROTA.TIPO_QUARTO.ATUALIZAR + "/1"}
              className="crud-btn crud-atualizar"
            >
              <i className="fas fa-edit"></i>
              <span>Alterar</span>
            </Link>

            {/* Botão Excluir */}
            <Link
              to={ROTA.TIPO_QUARTO.EXCLUIR + "/1"}
              className="crud-btn crud-excluir"
            >
              <i className="fas fa-trash"></i>
              <span>Excluir</span>
            </Link>
          </div>
        </div>

        {/* Grid com opções CRUD para QUARTO */}
        <div className="crud-container">
          <h2>Quarto</h2>

          <div className="crud-grid">
            {/* Botão Listar */}
            <Link to={ROTA.QUARTO.LISTAR} className="crud-btn crud-listar">
              <i className="fas fa-list"></i>
              <span>Listar</span>
            </Link>

            {/* Botão Buscar (Consultar) */}
            <Link
              to={ROTA.QUARTO.POR_ID + "/1"}
              className="crud-btn crud-buscar"
            >
              <i className="fas fa-search"></i>
              <span>Buscar</span>
            </Link>

            {/* Botão Criar */}
            <Link to={ROTA.QUARTO.CRIAR} className="crud-btn crud-criar">
              <i className="fas fa-plus"></i>
              <span>Criar</span>
            </Link>

            {/* Botão Alterar */}
            <Link
              to={ROTA.QUARTO.ATUALIZAR + "/1"}
              className="crud-btn crud-atualizar"
            >
              <i className="fas fa-edit"></i>
              <span>Alterar</span>
            </Link>

            {/* Botão Excluir */}
            <Link
              to={ROTA.QUARTO.EXCLUIR + "/1"}
              className="crud-btn crud-excluir"
            >
              <i className="fas fa-trash"></i>
              <span>Excluir</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
TUTORIAL: Como o DASHBOARD está funcionando

Dashboard no meio da tela:
O card fica centralizado porque:

O Dashboard.tsx usa className="display" + className="card"
Esses estilos CSS (em seus arquivos .css) provavelmente têm display: flex, justify-content: center e align-items: center para centralizar o conteúdo
Dashboard virou página home:
Aconteceu por causa do roteamento:

Quando você acessa http://localhost:5173/ (a raiz), o React Router intercepta isso
No arquivo router.tsx, existe um redirect automático: quando alguém tenta acessar /, é redirecionado para /sistema/dashboard
O Dashboard está como child do Layout, então é renderizado dentro da estrutura do Layout (header + conteúdo)
Resumindo: CSS centraliza o card visualmente, e o router faz o Dashboard ser a página inicial automaticamente.

*/
