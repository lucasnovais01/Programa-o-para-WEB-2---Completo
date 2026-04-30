import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/auth/hook/useAuth";
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
