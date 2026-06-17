import { http } from '../../axios/config.axios';
// import { ROTA } from '../../router/url';

// A rota de navegação do frontend (`ROTA.AUTH.LOGIN`) não é a mesma coisa
// que a rota de API para autenticação. A primeira é usada para exibir a
// página de login dentro do React. A segunda é o endpoint que recebe o
// email e a senha e retorna o token JWT.

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

// Endpoint do backend que processa o login. No backend isso está definido
// em `nest_academico/src/auth/controllers/auth.controllers.ts` como
// `@Controller('auth')` + `@Post('/session/login')`.
const AUTH_API_LOGIN = '/auth/session/login';

export const apiLogin = async (dados: LoginRequest): Promise<LoginResponse> => {
  //  const response = await http.post<LoginResponse>(ROTA.AUTH.LOGIN, dados);

  // `http.post` já inclui o `baseURL` configurado em `config.axios`.
  // Aqui passamos apenas o caminho relativo da API de login.
  const response = await http.post<LoginResponse>(AUTH_API_LOGIN, dados);

  // Retorna o JSON do backend para o frontend usar.
  // Esse JSON deve incluir o token, o tipo de token, a expiração e os dados do usuário.
  return response.data;
};

// Coloquei .CRIAR mas não é o ideal