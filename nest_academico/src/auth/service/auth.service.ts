/*

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConverterUsuario } from '../dto/converter/usuario.converter';
import { UsuarioResponse } from '../dto/response/usuario.response';
import { Usuario } from '../entity/usuario.entity';

@Injectable()
export class UsuarioServiceFindOne {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findOne(idUsuario: number): Promise<UsuarioResponse> {
    const usuario = await this.findById(idUsuario);

    if (!usuario) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }

    return ConverterUsuario.toUsuarioResponse(usuario);
  }

  async findById(idUsuario: number): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.ID_USUARIO = :idUsuario', { idUsuario: idUsuario })
      .getOne();

    return usuario;
  }
}

*/
