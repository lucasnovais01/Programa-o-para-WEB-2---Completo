import { createContext } from "react";

export interface FuncionarioLogado {
  idUsuario: number;
  nomeLogin: string;
  emailUsuario: string | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  funcionario: FuncionarioLogado | null;
  accessToken: string | null;
  setAuth: (token: string, funcionario: FuncionarioLogado) => void;
  clearAuth: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
