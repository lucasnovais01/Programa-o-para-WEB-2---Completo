import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    Req,
} from "@nestjs/common";
import type { Request } from "express";
import { TIPO_QUARTO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { Page } from 'src/commons/pagination/page.sistema';
import { geraPageLinks } from 'src/commons/utils/hateoas.utils';
import { TipoQuartoResponse } from '../dto/response/tipo-quarto.response';
import { TipoQuartoServiceFindAll } from '../service/tipo-quarto.service.findall';

@Controller(ROTA.TIPO_QUARTO.BASE.substring(1))
export class TipoQuartoControllerFindAll {
  constructor(
    private readonly tipoQuartoServiceFindAll: TipoQuartoServiceFindAll
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.TIPO_QUARTO.ENDPOINTS.LIST)
  async findAll(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('props') props?: string,
    @Query('order') order?: string,
  ): Promise<Result<Page<TipoQuartoResponse>>> {
    const response = await this.tipoQuartoServiceFindAll.findAll(
      page ? Number(page) : PAGINATION.PAGE,
      pageSize ? Number(pageSize) : PAGINATION.PAGESIZE,
      props,
      order,
    );

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      "Lista de tipos de quarto gerada com sucesso!",
      response,
      ROTA.TIPO_QUARTO.LIST,
      null,
      geraPageLinks(req, response, TIPO_QUARTO),
    );
  }
}
