import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConverterUsuario } from '../dto/converter/usuario.converter';
import { UsuarioRequest } from '../dto/request/usuario.request';
import { UsuarioResponse } from '../dto/response/usuario.response';
import { Usuario } from '../entity/usuario.entity';

@Injectable()
export class UsuarioServiceCreate {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(usuarioRequest: UsuarioRequest): Promise<UsuarioResponse> {
    /*
    // O método toUsuario agora é async por causa do bcrypt
    let usuario = await ConverterUsuario.toUsuario(usuarioRequest);
    */
    let usuario = ConverterUsuario.toUsuario(usuarioRequest);

    const usuarioCadastrado = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.emailUsuario =:email', { email: usuario.emailUsuario })
      .getOne();

    if (usuarioCadastrado) {
      throw new HttpException(
        'Usuário com email informado já está cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    usuario = await this.usuarioRepository.save(usuario);

    return ConverterUsuario.toUsuarioResponse(usuario);
  }
}
