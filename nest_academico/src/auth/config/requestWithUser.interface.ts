import { Request } from 'express';

export interface AuthMeta {
  ip: string; //192.168.0.100, 200.202.110.5
  userAgent: string; //navegador, postman
  browser: string; // chrome, edge, .....
  os: string;
  platform: string;
}

export interface RequestUserPayload {
  idUsuario: number;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  isVerified: boolean;
}

interface RequestWithUser extends Request {
  user: RequestUserPayload;
  authMeta: AuthMeta;
}

export default RequestWithUser;
