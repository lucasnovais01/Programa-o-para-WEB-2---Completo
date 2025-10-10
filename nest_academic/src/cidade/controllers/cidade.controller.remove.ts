import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { CidadeServiceRemove } from '../service/cidade.service.remove';
import { ROTA } from 'src/commons/constants/url.sistema';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import type { Request } from 'express';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerRemove {
  constructor(private readonly cidadeServiceRemove: CidadeServiceRemove) {}

  // Retornar 204 é o mais apropriado para delete sem corpo
  @HttpCode(HttpStatus.NO_CONTENT) //O correto é o NO_CONTENT, foi trocado (HttpStatus.OK)
  @Delete(ROTA.CIDADE.DELETE)
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<void>> {

    await this.cidadeServiceRemove.remove(id);

    const path = (req as any).path ?? (req as any).url ?? req.originalUrl;

    return MensagemSistema.showMensagem(
      HttpStatus.NO_CONTENT, // O NO_CONTENT é o normal, porém, não volta nada
      'Cidade excluída com sucesso!',
      null,
      path,
      null,
    );    
  }
}

/*remove(@Param('id', ParseIntPipe) id: number) {
    return this.cidadeServiceRemove.remove(id);
  }
*/

/*
    const response = this.cidadeServiceRemove.remove(id, cidadeRequest);
    return response;
*/
