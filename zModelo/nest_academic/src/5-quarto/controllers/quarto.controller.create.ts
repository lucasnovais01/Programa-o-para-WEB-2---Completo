import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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
import { QuartoServiceCreate } from '../service/quarto.service.create';

@Controller(ROTA.QUARTO.BASE.substring(1))
export class QuartoControllerCreate {
  constructor(private readonly quartoServiceCreate: QuartoServiceCreate) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(ROTA.QUARTO.ENDPOINTS.CREATE)
  async create(
    @Req() req: Request,
    @Body() quartoRequest: QuartoRequest,
  ): Promise<Result<QuartoResponse>> {
    const response = await this.quartoServiceCreate.create(quartoRequest);

    return MensagemSistema.showMensagem(
      HttpStatus.CREATED,
      'Quarto cadastrado com sucesso!',
      response,
      ROTA.QUARTO.CREATE,
      null,
      response?.idQuarto
        ? gerarLinks(req, QUARTO, response.idQuarto)
        : gerarLinks(req, QUARTO),
    );
  }
}
