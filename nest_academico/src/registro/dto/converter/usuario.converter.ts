import { plainToInstance } from 'class-transformer';

//import { Cidade } from 'src/cidade/entity/cidade.entity';
//import { CidadeRequest } from '../request/cidade.request';
//import { CidadeResponse } from '../response/cidade.response';

import { Usuario } from 'src/usuario/entity/usuario.entity';

export class ConverterUsuario {
  static toUsuario(usuarioRequest: UsuarioRequest) {
    const usuario = new Usuario();

    if (usuarioRequest.idUsuario != null) {
      usuario.idUsuario = usuarioRequest.idUsuario;
    }
    usuario.nomeUsuario = usuarioRequest.nomeUsuario;
    usuario.emailUsuario = usuarioRequest.emailUsuario;

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
