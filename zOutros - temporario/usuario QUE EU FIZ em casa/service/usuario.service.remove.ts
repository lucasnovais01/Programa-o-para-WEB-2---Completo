import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from '../entity/usuario.entity';
import { UsuarioServiceFindOne } from './usuario.service.findone';

@Injectable()
export class UsuarioServiceRemove {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private readonly service: UsuarioServiceFindOne,
  ) {}

  async remove(idUsuario: number): Promise<void> {
    const usuario = await this.service.findById(idUsuario);

    if (!usuario?.idUsuario) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }

    await this.usuarioRepository
      .createQueryBuilder('usuario')
      .delete()
      .from(Usuario)
      .where('usuario.ID_USUARIO =:idUsuario ', {
        idUsuario: usuario?.idUsuario,
      })
      .execute();
  }
}
