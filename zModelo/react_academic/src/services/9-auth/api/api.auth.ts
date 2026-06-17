import { httpRoot } from '../../axios/config.axios';
import { API_AUTH } from '../constants/api.auth';

export interface LoginRequest {
  loginUsuario: string;
  senhaUsuario: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;

  usuario: {
    idUsuario: number;
    nomeLogin: string;
    emailUsuario: string | null;
  };
}

export const apiLogin = async (dados: LoginRequest): Promise<LoginResponse> => {
  // Usamos httpRoot aqui porque o endpoint de autenticação não deve ser
  // chamado usando o prefixo `/rest/sistema/v1`.
  //
  // O `http` padrão no projeto está configurado para `REST_CONFIG.BASE_URL`
  // (algo como `http://localhost:8000/rest/sistema/v1`). Se usássemos `http`
  // para login, a requisição poderia virar
  // `http://localhost:8000/rest/sistema/v1/auth/session/login` e falhar.
  const response = await httpRoot.post<LoginResponse>(API_AUTH.LOGIN, {
    login: dados.loginUsuario,
    password: dados.senhaUsuario,
  });
  return response.data;
};

export interface ForgotPasswordRequest {
  email: string;
}

export const apiForgotPassword = async (
  dados: ForgotPasswordRequest,
): Promise<void> => {
  await httpRoot.post(API_AUTH.FORGOT, { email: dados.email });
};

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const apiResetPassword = async (
  dados: ResetPasswordRequest,
): Promise<void> => {
  await httpRoot.post(API_AUTH.RESET, {
    token: dados.token,
    newPassword: dados.newPassword,
  });
};
