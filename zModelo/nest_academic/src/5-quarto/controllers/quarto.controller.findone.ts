import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { QUARTO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { QuartoResponse } from '../dto/response/quarto.response';
import { QuartoServiceFindOne } from '../service/quarto.service.findone';

@Controller(ROTA.QUARTO.BASE.substring(1))
export class QuartoControllerFindOne {
  constructor(private readonly quartoServiceFindOne: QuartoServiceFindOne) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.QUARTO.ENDPOINTS.BY_ID)
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<QuartoResponse | null>> {
    const response = await this.quartoServiceFindOne.findOne(id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Quarto recuperado com sucesso',
      response,
      ROTA.QUARTO.BY_ID,
      null,
      response?.idQuarto
        ? gerarLinks(req, QUARTO, response.idQuarto)
        : gerarLinks(req, QUARTO),
    );
  }
}
