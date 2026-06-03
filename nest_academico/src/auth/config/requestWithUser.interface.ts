import { Request } from 'express';
import { Usuario } from '../../usuario/entities/usuario.entity';

export interface AuthMeta {
  ip: string; // 192.168.0.100, 200.202.110.5
  userAgent: string; // userAgent pode ser o Chrome, Edge, etc... Ou postman nos testes
  browser: string; // nome do navegador chrome, edge, ...
  os: string;
  platform: string;
}

// estes dados vão ficar junto com o Token, dados de quem está acessando
export interface RequestUserPayload {
  idUsuario: number;
  email: string;
  name: string;
  role: string;
  permission: string[];
  isVerified: boolean;
}

// Dados do
interface RequestWithUser extends Request {
  // é obrigatorio usar a palavra 'user', pq o npm install passport só trabalha com esta palavra

  user: RequestUserPayload;
  authMeta: AuthMeta;
}

export default RequestWithUser;
