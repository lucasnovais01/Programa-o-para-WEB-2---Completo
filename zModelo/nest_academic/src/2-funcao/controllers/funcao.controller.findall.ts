import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { FUNCAO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiListDoc } from 'src/commons/decorators/swagger.decorators';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { geraPageLinks } from 'src/commons/utils/hateoas.utils';
import { FuncaoResponse } from '../dto/response/funcao.response';
import { FuncaoServiceFindAll } from '../service/funcao.service.findall';

@Controller(ROTA.FUNCAO.BASE.substring(1))
export class FuncaoControllerFindAll {
  constructor(private readonly funcaoServiceFindAll: FuncaoServiceFindAll) {}

  @ApiListDoc(
    {
      ACAO: 'Listar funções',
      SUCESSO: 'Lista de funções retornada com sucesso',
      ERRO: 'Erro ao listar funções',
    },
    FuncaoResponse,
  )
  @HttpCode(HttpStatus.OK)
  @Get(ROTA.FUNCAO.ENDPOINTS.LIST)
  async findAll(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('props') props?: string,
    @Query('order') order?: string,
  ): Promise<Result<any>> {
    const response = await this.funcaoServiceFindAll.findAll(
      page ? Number(page) : PAGINATION.PAGE,
      pageSize ? Number(pageSize) : PAGINATION.PAGESIZE,
      props,
      order,
    );

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Lista de funções gerada com sucesso!',
      response,
      ROTA.FUNCAO.LIST,
      null,
      geraPageLinks(req, response, FUNCAO),
    );
  }
}
