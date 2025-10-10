import type { RouteObject } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import ListarCidade from "../../views/cidade/Lista";

// este é o servidor do REACT
//http://localhost:3000/sistema/cidade/listar

export const routes:RouteObject[] = [
  {
    path: '/sistema',
    element: <Layout />,
    children: [
      {
        path: '/sistema/cidade/listar',
        element: <ListarCidade />,
      }
    ]
  },
];