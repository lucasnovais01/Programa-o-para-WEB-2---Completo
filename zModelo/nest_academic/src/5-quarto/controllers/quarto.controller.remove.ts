import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from 'src/commons/constants/url.sistema';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { QuartoServiceRemove } from '../service/quarto.service.remove';

@Controller(ROTA.QUARTO.BASE.substring(1))
export class QuartoControllerRemove {
  constructor(private readonly quartoServiceRemove: QuartoServiceRemove) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(ROTA.QUARTO.ENDPOINTS.DELETE)
  async remove(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Result<null>> {
    await this.quartoServiceRemove.remove(Number(id));

    return MensagemSistema.showMensagem(
      HttpStatus.NO_CONTENT,
      'Quarto removido com sucesso',
      null,
      ROTA.QUARTO.DELETE,
      null,
    );
  }
}
