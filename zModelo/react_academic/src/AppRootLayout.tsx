import { Outlet } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";

/**
 * AppRootLayout - Componente raiz das rotas com AuthProvider.
 *
 * Este arquivo fica no mesmo nível de App.tsx para evitar criar
 * um componente de layout aninhado em src/components/layout.
 */
export default function AppRootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
