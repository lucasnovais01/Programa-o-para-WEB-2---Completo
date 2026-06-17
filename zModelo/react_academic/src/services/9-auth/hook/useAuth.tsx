
// Hook para acessar o Context de Autenticação

import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../../../providers/AuthContext";

/**
 * useAuth Hook
 *
 * ANTES (problema):
 * - Lia localStorage apenas no mount
 * - Se login acontecia, componentes não sabiam
 * - Botão de login não virava logout
 *
 * AGORA (solução):
 * - Lê do Context (estado global)
 * - Qualquer mudança no Context atualiza todos os componentes
 * - Login → componentes atualizados automaticamente
 * - Logout → componentes atualizados automaticamente
 *
 * USO:
 * const { isAuthenticated, funcionario, logout } = useAuth();
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser usado dentro de um AuthProvider"
    );
  }

  return context;
};
