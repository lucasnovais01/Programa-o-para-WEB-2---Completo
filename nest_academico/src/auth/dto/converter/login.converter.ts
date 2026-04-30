/*
import { plainToInstance } from 'class-transformer';
// import { hash } from 'bcrypt'; // npm install bcrypt + npm install -D @types/bcrypt

import { Login } from 'src/usuario/entity/login.entity';

import { LoginRequest } from '../request/login.request';
import { LoginResponse } from '../response/login.response';

export class ConverterLogin {
  static toUsuario(loginRequest: LoginRequest) {
    const login = new Login();

    // Duvida: O login devo usar somente o email e senha

    // Login devo usar os dados do usuario?
    login.emailUsuario = usuarioRequest.emailUsuario;
    login.senhaUsuario = usuarioRequest.senhaUsuario;

    return login;
  }

  static toUsuarioResponse(usuario: Usuario): UsuarioResponse {
    return plainToInstance(UsuarioResponse, usuario, {
      excludeExtraneousValues: true,
    });
  }

  static toListUsuarioResponse(usuarios: Usuario[] = []): UsuarioResponse[] {
    return plainToInstance(UsuarioResponse, usuarios, {
      excludeExtraneousValues: true,
    });
  }
}
*/
