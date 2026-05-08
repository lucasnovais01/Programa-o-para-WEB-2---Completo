/*
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConverterUsuario } from '../dto/converter/usuario.converter';
import { UsuarioRequest } from '../dto/request/usuario.request';
import { UsuarioResponse } from '../dto/response/usuario.response';
import { Usuario } from '../entity/usuario.entity';
import { UsuarioServiceFindOne } from './usuario.service.findone';

@Injectable()
export class UsuarioServiceUpdate {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private usuarioServiceFindOne: UsuarioServiceFindOne,
  ) {}

  async update(
    idUsuario: number,
    usuarioRequest: UsuarioRequest,
  ): Promise<UsuarioResponse> {

    // O método toUsuario agora é async por causa do bcrypt
    // let usuario = await ConverterUsuario.toUsuario(usuarioRequest);

    let usuario = ConverterUsuario.toUsuario(usuarioRequest);

    const usuarioCadastrado =
      await this.usuarioServiceFindOne.findById(idUsuario);

    if (!usuarioCadastrado) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }

    const usuarioAtualizado = Object.assign(usuarioCadastrado, usuario);

    usuario = await this.usuarioRepository.save(usuarioAtualizado);

    return ConverterUsuario.toUsuarioResponse(usuario);
  }
}

*/
