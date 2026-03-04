import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { CidadeServiceRemove } from '../service/cidade.service.remove';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerRemove {
  constructor(private readonly cidadeServiceRemove: CidadeServiceRemove) {}

  @HttpCode(HttpStatus.OK) //NO_CONTENT
  @Delete(ROTA.CIDADE.DELETE)
  async remove(
    @Req() res: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<void>> {
    await this.cidadeServiceRemove.remove(id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Cidade excluída com sucesso!',
      null,
      res.path,
      null,
    );
  }
}
