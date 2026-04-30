import { http } from '../../axios/config.axios';
import { ROTA } from '../../router/url';

export interface LoginRequest {
  emailUsuario: string;
  senhaUsuario: string;
}

export interface LoginResponse {

  accessToken: string;
  tokenType: string;
  expiresIn: number;

  usuario: {
    idUsuario: number;
    nomeUsuario: string;
    sobrenomeUsuario: string;
    emailUsuario: string;
  };
}

export const apiLogin = async (dados: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>(ROTA.AUTH.LOGIN, dados);
  return response.data;
};

// Coloquei .CRIAR mas não é o ideal