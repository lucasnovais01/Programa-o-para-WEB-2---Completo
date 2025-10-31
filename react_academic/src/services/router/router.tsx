import type { RouteObject } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Dashboard from "../../views/Dashboard";
import ListarCidade from "../../views/cidade/Listar";
import CriarCidade from "../../views/cidade/Criar";
import AlterarCidade from "../../views/cidade/Alterar";
import ExcluirCidade from "../../views/cidade/Excluir";
import ConsultarCidade from "../../views/cidade/Consultar";

// este é o servidor do REACT
//http://localhost:3000/sistema/cidade/listar

export const routes:RouteObject[] = [
  {
    path: '/sistema',
    element: <Layout />,  // componente PAI
    children: [
      {
        path: '/sistema/dashboard',
        element: <Dashboard />, //componente a ser carregado (FILHO)
      },
      {
        path: '/sistema/cidade/listar',
        element: <ListarCidade />,
      },

      {
        path: '/sistema/cidade/criar',
        element: <CriarCidade />,
      },
      {
        path: '/sistema/cidade/alterar',
        element: <AlterarCidade />,
      },
      {
        path: '/sistema/cidade/excluir',
        element: <ExcluirCidade />,
      },
      {
        path: '/sistema/cidade/consultar',
        element: <ConsultarCidade />,
      },
    ]
  },
];