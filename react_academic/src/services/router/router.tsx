import type { RouteObject } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Dashboard from "../../views/Dashboard";
import ListarCidade from "../../views/cidade/Listar";
import CriarCidade from "../../views/cidade/Criar";
import AlterarCidade from "../../views/cidade/Alterar";
import ExcluirCidade from "../../views/cidade/Excluir";
import ConsultarCidade from "../../views/cidade/Consultar";
import { ROTA } from "./url";

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
    ],
  },
];