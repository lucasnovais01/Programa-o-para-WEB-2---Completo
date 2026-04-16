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
import { CIDADE } from '../constants/cidade.constants';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceFindAll } from '../service/cidade.service.findall';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerFindAll {
  constructor(private readonly cidadeServiceFindAll: CidadeServiceFindAll) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.CIDADE.LIST)
  async findAll(
    @Req() req: Request,
    //pega o parâmetro da url http://localhost:8000/rest/sistema/cidade/listar?page=1&pageSize=5
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('props') props?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('searchTerm') search?: string,
  ): Promise<Result<Page<CidadeResponse>>> {
    const response = await this.cidadeServiceFindAll.findAll(
      page ? Number(page) : PAGINATION.PAGE,
      pageSize ? Number(pageSize) : PAGINATION.PAGESIZE,
      props ? props : CIDADE.TABLE_FIELD.NOME_CIDADE,
      order ? order : PAGINATION.ASC,
      search,
    );
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Lista de cidade gerada com sucesso!',
      response,
      req.path,
      null,
      null,
    );
  }
}
