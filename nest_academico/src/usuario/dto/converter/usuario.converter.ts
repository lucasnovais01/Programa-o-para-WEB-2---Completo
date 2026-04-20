import { plainToInstance } from 'class-transformer';

import { Usuario } from 'src/usuario/entity/usuario.entity';

import { UsuarioRequest } from '../request/usuario.request';
import { UsuarioResponse } from '../response/usuario.response';

export class ConverterUsuario {
  static toUsuario(usuarioRequest: UsuarioRequest) {
    const usuario = new Usuario();

    if (usuarioRequest.idUsuario != null) {
      usuario.idUsuario = usuarioRequest.idUsuario;
    }
    usuario.nomeUsuario = usuarioRequest.nomeUsuario;
    usuario.sobrenomeUsuario = usuarioRequest.sobrenomeUsuario;
    usuario.emailUsuario = usuarioRequest.emailUsuario;
    usuario.senhaUsuario = usuarioRequest.senhaUsuario;

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
