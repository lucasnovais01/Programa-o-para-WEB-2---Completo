import type { RouteObject } from "react-router-dom";

import Layout from "../../components/layout/Layout";
//
//
//
import AppRootLayout from "../../AppRootLayout";
//
//
//
import ForgotPassword from "../../views/9-auth/ForgotPassword";
import Login from "../../views/9-auth/Login";
import ResetPassword from "../../views/9-auth/ResetPassword";
import Dashboard from "../../views/Dashboard";
import DevTools from "../../views/DevTools";
// Observação: usar um redirect da raiz para o DevTools para que
// acessar '/' não gere erro de rota inexistente.
import { Navigate } from "react-router-dom";

// Importações do módulo Hóspede
import AlterarHospede from "../../views/1-hospede/Alterar";
import ConsultarHospede from "../../views/1-hospede/Consultar";
import CriarHospede from "../../views/1-hospede/Criar";
import ExcluirHospede from "../../views/1-hospede/Excluir";
import ListarHospede from "../../views/1-hospede/Listar";

// Importação do módulo Função
import AlterarFuncao from "../../views/2-funcao/Alterar";
import ConsultarFuncao from "../../views/2-funcao/Consultar";
import CriarFuncao from "../../views/2-funcao/Criar";
import ExcluirFuncao from "../../views/2-funcao/Excluir";
import ListarFuncao from "../../views/2-funcao/Listar";

// Importação do módulo Funcionário
import AlterarFuncionario from "../../views/3-funcionario/Alterar";
import ConsultarFuncionario from "../../views/3-funcionario/Consultar";
import CriarFuncionario from "../../views/3-funcionario/Criar";
import ExcluirFuncionario from "../../views/3-funcionario/Excluir";
import ListarFuncionario from "../../views/3-funcionario/Listar";

// Importação do módulo Tipo Quarto
import AlterarTipoQuarto from "../../views/4-tipo-quarto/Alterar";
import ConsultarTipoQuarto from "../../views/4-tipo-quarto/Consultar";
import CriarTipoQuarto from "../../views/4-tipo-quarto/Criar";
import ExcluirTipoQuarto from "../../views/4-tipo-quarto/Excluir";
import ListarTipoQuarto from "../../views/4-tipo-quarto/Listar";

// Importação do módulo Quarto
import AlterarQuarto from "../../views/5-quarto/Alterar";
import ConsultarQuarto from "../../views/5-quarto/Consultar";
import CriarQuarto from "../../views/5-quarto/Criar";
import ExcluirQuarto from "../../views/5-quarto/Excluir";
import ListarQuarto from "../../views/5-quarto/Listar";
/*
*/
// 6-módulo reserva (futuro)

//
import { ROTA } from "./url";

// ============================================================
// ESTRUTURA DE ROTAS COM APPROOTLAYOUT
// AppRootLayout envolve tudo com AuthProvider, permitindo que
// useNavigate() funcione corretamente nos componentes internos.
// ============================================================
export const routes: RouteObject[] = [
  {
    path: '', // rota raiz (sem caminho)
    element: <AppRootLayout />, // envolve com AuthProvider + Outlet
    children: [
      // Redirecionamento da raiz '/' para o Dashboard
      {
        path: '/',
        element: <Navigate to="/sistema/dashboard" replace />,
      },
      {
        path: ROTA.AUTH.RESET,
        element: <ResetPassword />,
      },

      {
        path: '/sistema',
        element: <Layout />, // SEM children
        children: [
          // Rota de Login (módulo 9-auth) dentro do Layout para manter cabeçalho
          {
            path: ROTA.AUTH.LOGIN,
            element: <Login />,
          },
          {
            path: ROTA.AUTH.FORGOT,
            element: <ForgotPassword />,
          },
          {
            path: '/sistema/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/sistema/devtools',
            element: <DevTools />,
          },
          {
            path: ROTA.HOSPEDE.LISTAR,
            element: <ListarHospede />,
          },
          {
            path: ROTA.HOSPEDE.CRIAR,
            element: <CriarHospede />,
          },
          {
            path: `${ROTA.HOSPEDE.ATUALIZAR}/:idUsuario`,
            element: <AlterarHospede />,
          },
          {
            path: `${ROTA.HOSPEDE.EXCLUIR}/:idUsuario`,
            element: <ExcluirHospede />,
          },
          {
            path: `${ROTA.HOSPEDE.POR_ID}/:idUsuario`,
            element: <ConsultarHospede />,
          },
          // Rotas do módulo 2-funcao
          {
            path: ROTA.FUNCAO.LISTAR,
            element: <ListarFuncao />,
          },
          {
            path: ROTA.FUNCAO.CRIAR,
            element: <CriarFuncao />,
          },
          {
            path: `${ROTA.FUNCAO.ATUALIZAR}/:id`,
            element: <AlterarFuncao />,
          },
          {
            path: `${ROTA.FUNCAO.EXCLUIR}/:id`,
            element: <ExcluirFuncao />,
          },
          {
            path: `${ROTA.FUNCAO.POR_ID}/:id`,
            element: <ConsultarFuncao />,
          },

          // Rotas do módulo 3-funcionario
          {
            path: ROTA.FUNCIONARIO.LISTAR,
            element: <ListarFuncionario />,
          },
          {
            path: ROTA.FUNCIONARIO.CRIAR,
            element: <CriarFuncionario />,
          },
          {
            path: `${ROTA.FUNCIONARIO.ATUALIZAR}/:idUsuario`,
            element: <AlterarFuncionario />,
          },
          {
            path: `${ROTA.FUNCIONARIO.EXCLUIR}/:idUsuario`,
            element: <ExcluirFuncionario />,
          },
          {
            path: `${ROTA.FUNCIONARIO.POR_ID}/:idUsuario`,
            element: <ConsultarFuncionario />,
          },

          // Rotas do módulo 4-tipo-quarto
          {
            path: ROTA.TIPO_QUARTO.LISTAR,
            element: <ListarTipoQuarto />,
          },
          {
            path: ROTA.TIPO_QUARTO.CRIAR,
            element: <CriarTipoQuarto />,
          },
          {
            path: `${ROTA.TIPO_QUARTO.ATUALIZAR}/:codigoTipoQuarto`,
            element: <AlterarTipoQuarto />,
          },
          {
            path: `${ROTA.TIPO_QUARTO.EXCLUIR}/:codigoTipoQuarto`,
            element: <ExcluirTipoQuarto />,
          },
          {
            path: `${ROTA.TIPO_QUARTO.POR_ID}/:codigoTipoQuarto`,
            element: <ConsultarTipoQuarto />,
          },

          // Rotas do módulo 5-quarto
          {
            path: ROTA.QUARTO.LISTAR,
            element: <ListarQuarto />,
          },
          {
            path: ROTA.QUARTO.CRIAR,
            element: <CriarQuarto />,
          },
          {
            path: `${ROTA.QUARTO.ATUALIZAR}/:idQuarto`,
            element: <AlterarQuarto />,
          },
          {
            path: `${ROTA.QUARTO.EXCLUIR}/:idQuarto`,
            element: <ExcluirQuarto />,
          },
          {
            path: `${ROTA.QUARTO.POR_ID}/:idQuarto`,
            element: <ConsultarQuarto />,
          },
        ],
      },
    ],
  },
];