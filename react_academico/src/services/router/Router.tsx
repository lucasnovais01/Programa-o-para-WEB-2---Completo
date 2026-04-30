import { Navigate, type RouteObject } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Dashboard from "../../views/Dashboard";
import AlterarCidade from "../../views/cidade/Alterar";
import ConsultarCidade from "../../views/cidade/Consultar";
import CriarCidade from "../../views/cidade/Criar";
import ExcluirCidade from "../../views/cidade/Excluir";
import ListarCidade from "../../views/cidade/Listar";
//
import AlterarUsuario from "../../views/usuario/Alterar";
import ConsultarUsuario from "../../views/usuario/Consultar";
import CriarUsuario from "../../views/usuario/Criar";
import ExcluirUsuario from "../../views/usuario/Excluir";
import ListarUsuario from "../../views/usuario/Listar";
//
// Não implementado ainda
import ProtectedRoute from "../../components/auth/ProtectedRoute";

// ERRADO: import Auth from "../../views/auth/Login";
//
import { ROTA } from "./url";
import Login from "../../views/auth/Login";

//localhost:3000/sistema/cidade/listar

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/sistema/dashboard" replace />,
  },
  {
    path: "/sistema",
    element: <Layout />, // componente (pai)
    children: [
      {
        path: "/sistema/dashboard", //url
        element: <Dashboard />, //componente a ser carregado (filho)
      },
      {
        path: ROTA.CIDADE.LISTAR,
        element: <ListarCidade />,
      },
      {
        path: ROTA.CIDADE.CRIAR,
        element: <CriarCidade />,
      },
      {
        path: `${ROTA.CIDADE.ATUALIZAR}/:idCidade`,
        element: <AlterarCidade />,
      },
      {
        path: `${ROTA.CIDADE.EXCLUIR}/:idCidade`,
        element: <ExcluirCidade />,
      },
      {
        path: `${ROTA.CIDADE.POR_ID}/:idCidade`,
        element: <ConsultarCidade />,
      },

      // Aqui começa as rotas de usuário
      {
        path: ROTA.USUARIO.LISTAR,
        element: <ListarUsuario />,
      },
      {
        path: ROTA.USUARIO.CRIAR,
        element: <CriarUsuario />,
      },
      {
        path: `${ROTA.USUARIO.ATUALIZAR}/:idUsuario`,
        element: <AlterarUsuario />,
      },
      {
        path: `${ROTA.USUARIO.EXCLUIR}/:idUsuario`,
        element: <ExcluirUsuario />,
      },
      {
        path: `${ROTA.USUARIO.POR_ID}/:idUsuario`,
        element: <ConsultarUsuario />,
      },

      // Login só tem a pagina de login, Coloquei CRIAR, mas não é o ideal
      {
        path: ROTA.AUTH.LOGIN,
        element: <Login />,
      },
    ],
  },
];

/*
// Usando o componente: react_academico\src\components\auth\ProtectedRoute.tsx

<Route
  path={ROTA.USUARIO.LISTAR}
  element={
    <ProtectedRoute>
      <ListarUsuario />
    </ProtectedRoute>
  }
/>

*/