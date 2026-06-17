import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROTA } from "../services/router/url";
import { AuthContext, type AuthContextType, type FuncionarioLogado } from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * ============================================================================
 * AuthProvider - Gerenciador Global de Autenticação
 * ============================================================================
 *
 * RESPONSABILIDADES:
 * 1. Manter estado global de autenticação (token + usuário)
 * 2. Sincronizar com localStorage para persistência
 * 3. Notificar todos os componentes quando auth muda
 * 4. Fornecer funções de login/logout
 *
 * PROBLEMA RESOLVIDO:
 * - useAuth anterior só lia localStorage no mount
 * - Agora qualquer componente pode chamar setAuth() para atualizar
 * - Todos os componentes que usam useAuth recebem notificação instantânea
 * - Login/logout atualiza o header imediatamente
 *
 * FLUXO:
 * 1. useLogin.tsx faz login → recebe token + funcionario
 * 2. Chama setAuth(token, funcionario)
 * 3. Provider atualiza estado + localStorage
 * 4. Todos os useAuth() são atualizados
 * 5. Layout renderiza com usuário logado e botão de logout
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [funcionario, setFuncionario] = useState<FuncionarioLogado | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * useEffect - Inicialização (rodar apenas uma vez)
   *
   * Tenta ler dados do localStorage quando o app inicia.
   * Se houver token + funcionário salvos, restaura automaticamente.
   */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const funcionarioStr =
      localStorage.getItem("funcionario") ??
      localStorage.getItem("usuario");

    if (token && funcionarioStr) {
      try {
        const funcionarioData = JSON.parse(funcionarioStr);
        setAccessToken(token);
        setFuncionario(funcionarioData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao parse localStorage:", error);
        // Se falhar, limpa o que estava corrompido
        localStorage.removeItem("accessToken");
        localStorage.removeItem("funcionario");
        localStorage.removeItem("usuario");
      }
    }

    setIsLoading(false);
  }, []);

  /**
   * setAuth(token, funcionario)
   *
   * Chamado após login bem-sucedido.
   * Atualiza estado + localStorage + notifica todos os subscribers
   */
  const handleSetAuth = (token: string, user: FuncionarioLogado) => {
    setAccessToken(token);
    setFuncionario(user);
    setIsAuthenticated(true);

    // Persiste no localStorage para sobreviver ao refresh
    localStorage.setItem("accessToken", token);
    localStorage.setItem("funcionario", JSON.stringify(user));
    // Compatibilidade legada
    localStorage.setItem("usuario", JSON.stringify(user));
  };

  /**
   * clearAuth()
   *
   * Limpa localStorage mas mantém estado React (para transição suave)
   * Útil se token expirou ou houve erro
   */
  const handleClearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("funcionario");
    localStorage.removeItem("usuario");
    setAccessToken(null);
    setFuncionario(null);
    setIsAuthenticated(false);
  };

  /**
   * logout()
   *
   * Logout completo:
   * 1. Limpa localStorage
   * 2. Limpa estado React
   * 3. Redireciona para login
   */
  const handleLogout = () => {
    handleClearAuth();
    navigate(ROTA.AUTH.LOGIN);
  };

  const value: AuthContextType = {
    isAuthenticated,
    funcionario,
    accessToken,
    setAuth: handleSetAuth,
    clearAuth: handleClearAuth,
    logout: handleLogout,
  };

  // Evita renderizar componentes enquanto carrega localStorage
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
