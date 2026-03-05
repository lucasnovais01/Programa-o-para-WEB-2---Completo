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
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceFindAll } from '../service/cidade.service.findall';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerFindAll {
  constructor(private readonly cidadeServiceFindAll: CidadeServiceFindAll) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.CIDADE.LIST)
  async findAll(
    @Req() req: Request,

    @Query('page') page?: string, //Pega o parametro da URL http://localhost:8000/rest/sistema/cidade/listar
    @Query('pageSize') pageSize?: string,
    @Query('props') props?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    //
  ): Promise<Result<CidadeResponse[]>> {
    const response = await this.cidadeServiceFindAll.findAll(
      //
      page ? Number(page) : PAGINATION.PAGE,
      pageSize ? Number(pageSize) : PAGINATION.PAGESIZE,
      //Number(page), criamos o enum em commons pra facilitar
      //Number(pageSize),
      //
      props ? props : 'ID_CIDADE',
      order ? order : PAGINATION.ASC,
    );

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Lista de cidade gerada com sucesso!',
      response,
      req.path,
      null,
    );
  }
}
