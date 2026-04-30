import { plainToInstance } from 'class-transformer';
// import { hash } from 'bcrypt'; // npm install bcrypt + npm install -D @types/bcrypt

import { AuthRequest } from '../request/auth.request';
import { AuthResponse } from '../response/auth.response';
import { Auth } from '../../entity/auth.entity';

export class ConverterAuth {
  static toAuth(authRequest: AuthRequest) {
    const auth = new Auth();

    // O login devo usar somente o email e senha

    // Login devo usar os dados do usuario?
    auth.emailUsuario = authRequest.emailUsuario;
    auth.senhaUsuario = authRequest.senhaUsuario;

    return Auth;
  }

  static toAuthResponse(auth: Auth): AuthResponse {
    return plainToInstance(AuthResponse, auth, {
      excludeExtraneousValues: true,
    });
  }

  static toListAuthResponse(auths: Auth[] = []): AuthResponse[] {
    return plainToInstance(AuthResponse, auths, {
      excludeExtraneousValues: true,
    });
  }
}
