
// Criação de um Hook para Verificar se o Usuário está Logado

import { useEffect, useState } from "react";
import { ROTA } from "../../router/url";

export interface UsuarioLogado {
  idUsuario: number;
  nomeUsuario: string;
  sobrenomeUsuario: string;
  emailUsuario: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    const syncAuthFromStorage = () => {
      const token = localStorage.getItem('accessToken');
      const usuarioStr = localStorage.getItem('usuario');

      if (token && usuarioStr) {
        try {
          const parsedUsuario = JSON.parse(usuarioStr);
          if (parsedUsuario && typeof parsedUsuario === 'object') {
            setIsAuthenticated(true);
            setUsuario(parsedUsuario);
            return;
          }
        } catch (error) {
          console.warn('[useAuth] usuário inválido no storage, limpando dados', error);
        }
      }

      setIsAuthenticated(false);
      setUsuario(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('usuario');
    };

    // Sincroniza inicialmente
    syncAuthFromStorage();

    // Ouve mudanças vindas de outras abas (storage) e de eventos internos (auth-change)
    const storageHandler = (ev: StorageEvent) => {
      if (ev.key === 'accessToken' || ev.key === 'usuario' || ev.key === null) {
        syncAuthFromStorage();
      }
    };

    const customHandler = () => {
      syncAuthFromStorage();
    };

    window.addEventListener('storage', storageHandler);
    window.addEventListener('auth-change', customHandler as EventListener);

    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('auth-change', customHandler as EventListener);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUsuario(null);

    window.location.href = ROTA.AUTH.LOGIN;
  };

  return {
    isAuthenticated,
    usuario,
    logout,
  };
};