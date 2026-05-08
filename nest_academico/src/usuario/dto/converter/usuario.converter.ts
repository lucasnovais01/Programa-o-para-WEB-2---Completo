/*

import { plainToInstance } from 'class-transformer';
// import { hash } from 'bcrypt'; // npm install bcrypt + npm install -D @types/bcrypt

import { UsuarioRequest } from '../request/usuario.request';
import { UsuarioResponse } from '../response/usuario.response';
import { Usuario } from '../../entity/usuario.entity';

export class ConverterUsuario {
  static toUsuario(usuarioRequest: UsuarioRequest) {
    const usuario = new Usuario();

    if (usuarioRequest.idUsuario != null) {
      usuario.idUsuario = usuarioRequest.idUsuario;
    }
    usuario.nome_usuario = usuarioRequest.nomeUsuario;
    //usuario.sobrenomeUsuario = usuarioRequest.sobrenomeUsuario;
    usuario.email_usuario = usuarioRequest.emailUsuario;
    usuario.senha = usuarioRequest.senhaUsuario;

    return usuario;
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

/*
static async toUsuario(usuarioRequest: UsuarioRequest) {
  const usuario = new Usuario();

  if (usuarioRequest.idUsuario != null) {
    usuario.idUsuario = usuarioRequest.idUsuario;
  }
  usuario.nomeUsuario = usuarioRequest.nomeUsuario;
  usuario.sobrenomeUsuario = usuarioRequest.sobrenomeUsuario;
  usuario.emailUsuario = usuarioRequest.emailUsuario;

  // Criptografar a senha antes de salvar (bcrypt)
  const saltRounds = 10;
  usuario.senhaUsuario = await hash(usuarioRequest.senhaUsuario, saltRounds);

  return usuario;
}
*/
