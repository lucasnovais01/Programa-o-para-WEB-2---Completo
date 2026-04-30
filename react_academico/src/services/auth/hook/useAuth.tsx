
// Criação de um Hook para Verificar se o Usuário está Logado

import { useState, useEffect } from "react";
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
    const token = localStorage.getItem('accessToken');
    const usuarioStr = localStorage.getItem('usuario');
    
    if (token && usuarioStr) {
      setIsAuthenticated(true);
      setUsuario(JSON.parse(usuarioStr));
    } else {
      setIsAuthenticated(false);
      setUsuario(null);
    }
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