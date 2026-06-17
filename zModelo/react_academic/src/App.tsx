// Restaurando o padrão do professor (modelo em react_modelo):
// - O modelo usa `createBrowserRouter(routes)` + `<RouterProvider />`.
// - Essa forma é mais explícita e é o padrão seguido no material do curso.
// - AuthProvider agora fica dentro das rotas (AppRootLayout.tsx) para evitar
//   erro "useNavigate() may be used only in the context of a <Router> component."

// Import das rotas centralizadas (baseadas no modelo do professor)
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./services/router/router";

const router = createBrowserRouter(routes as RouteObject[]);

/**
 * App - Componente raiz da aplicação
 *
 * ESTRUTURA ATUAL:
 * App
 *   └─ RouterProvider
 *       └─ AppRootLayout (em routes, renderiza AuthProvider + Outlet)
 *           └─ AuthProvider (gerencia estado global de autenticação)
 *               └─ Outlet (renderiza as rotas internas)
 *
 * MUDANÇA: AuthProvider foi movido para AppRootLayout porque:
 * - AuthProvider usa useNavigate() no logout
 * - useNavigate() só funciona dentro de um Router context
 * - AppRootLayout fica como primeiro elemento nas rotas
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;