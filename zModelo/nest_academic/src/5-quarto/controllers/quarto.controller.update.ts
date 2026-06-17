import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { QUARTO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { QuartoRequest } from '../dto/request/quarto.request';
import { QuartoResponse } from '../dto/response/quarto.response';
import { QuartoServiceUpdate } from '../service/quarto.service.update';

@Controller(ROTA.QUARTO.BASE.substring(1))
export class QuartoControllerUpdate {
  constructor(private readonly quartoServiceUpdate: QuartoServiceUpdate) {}

  @HttpCode(HttpStatus.OK)
  @Put(ROTA.QUARTO.ENDPOINTS.UPDATE)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() quartoRequest: QuartoRequest,
  ): Promise<Result<QuartoResponse | null>> {
    const response = await this.quartoServiceUpdate.update(id, quartoRequest);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Quarto atualizado com sucesso',
      response,
      ROTA.QUARTO.UPDATE,
      null,
      gerarLinks(req, QUARTO, id),
    );
  }
}
