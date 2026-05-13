import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pageable } from '../../commons/pagination/page.response';
import { Page } from '../../commons/pagination/page.sistema';

import { USUARIO, fieldsUsuario } from '../constants/usuario.constants';
import { ConverterUsuario } from '../dto/converter/usuario.converter';
import { UsuarioResponse } from '../dto/response/usuario.response';
import { Usuario } from '../entity/usuario.entity';

@Injectable()
export class UsuarioServiceFindAll {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    props: string,
    order: 'ASC' | 'DESC',
    search?: string,
  ): Promise<Page<UsuarioResponse>> {
    const pageable = new Pageable(page, pageSize, props, order, fieldsUsuario);

    const query = this.usuarioRepository
      .createQueryBuilder(USUARIO.ENTITY)
      .orderBy(props, order)
      .offset(pageable.offset)
      .limit(pageable.limit);

    if (search) {
      query.where(`${props} LIKE :search_where`, {
        search_where: `%${search}%`,
      });
    }

    const [listaUsuarios, totalElements] = await query.getManyAndCount();

    const usuarios = ConverterUsuario.toListUsuarioResponse(listaUsuarios);

    return Page.of(usuarios, totalElements, pageable);
  }
}
