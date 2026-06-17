import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { QUARTO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { Page } from 'src/commons/pagination/page.sistema';
import { geraPageLinks } from 'src/commons/utils/hateoas.utils';
import { QuartoResponse } from '../dto/response/quarto.response';
import { QuartoServiceFindAll } from '../service/quarto.service.findall';

@Controller(ROTA.QUARTO.BASE.substring(1))
export class QuartoControllerFindAll {
  constructor(private readonly quartoServiceFindAll: QuartoServiceFindAll) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.QUARTO.ENDPOINTS.LIST)
  async findAll(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('props') props?: string,
    @Query('order') order?: string,
  ): Promise<Result<Page<QuartoResponse>>> {
    const response = await this.quartoServiceFindAll.findAll(
      page ? Number(page) : PAGINATION.PAGE,
      pageSize ? Number(pageSize) : PAGINATION.PAGESIZE,
      props,
      order,
    );

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Lista de quartos gerada com sucesso!',
      response,
      ROTA.QUARTO.LIST,
      null,
      geraPageLinks(req, response, QUARTO),
    );
  }
}
