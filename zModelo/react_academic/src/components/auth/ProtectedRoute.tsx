// Não está em uso ainda, mas é um componente que pode ser usado para proteger rotas que exigem autenticação. Ele verifica se o usuário está autenticado e, se não estiver, redireciona para a página de login.

import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/9-auth/hook/useAuth";
import { ROTA } from "../../services/router/url";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROTA.AUTH.LOGIN} replace />;
  }

  return <>{children}</>;
}
