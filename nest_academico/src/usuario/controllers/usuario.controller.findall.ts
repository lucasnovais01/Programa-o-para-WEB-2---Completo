import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { PAGINATION } from '../../commons/enum/paginacao.enum';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { Page } from '../../commons/pagination/page.sistema';

import { USUARIO } from '../constants/usuario.constants';

import { UsuarioServiceFindAll } from '../service/usuario.service.findall';
import { UsuarioResponse } from '../dto/response/usuario.response';

@Controller(ROTA.USUARIO.BASE)
export class UsuarioControllerFindAll {
  constructor(private readonly usuarioServiceFindAll: UsuarioServiceFindAll) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.USUARIO.LIST)
  async findAll(
    @Req() req: Request,
    //pega o parâmetro da url htt´p://localhost:8000/rest/sistema/usuario/listar?page=1&pageSize=5
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('props') props?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('searchTerm') search?: string,
  ): Promise<Result<Page<UsuarioResponse>>> {
    const response = await this.usuarioServiceFindAll.findAll(
      page ? Number(page) : PAGINATION.PAGE,
      pageSize ? Number(pageSize) : PAGINATION.PAGESIZE,
      props ? props : USUARIO.TABLE_FIELD.NOME_USUARIO,
      order ? order : PAGINATION.ASC,
      search,
    );
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Lista de usuário gerada com sucesso!',
      response,
      req.path,
      null,
      null,
    );
  }
}
