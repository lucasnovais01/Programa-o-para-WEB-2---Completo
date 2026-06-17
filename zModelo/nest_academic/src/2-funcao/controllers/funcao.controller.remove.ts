import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiDeleteDoc } from 'src/commons/decorators/swagger.decorators';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { FuncaoServiceRemove } from '../service/funcao.service.remove';

@Controller(ROTA.FUNCAO.BASE.substring(1))
export class FuncaoControllerRemove {
  constructor(private readonly funcaoServiceRemove: FuncaoServiceRemove) {}

  @ApiDeleteDoc({
    ACAO: 'Excluir função',
    SUCESSO: 'Função excluída com sucesso',
    NAO_LOCALIZADO: 'Função não encontrada',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(ROTA.FUNCAO.ENDPOINTS.DELETE)
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<void>> {
    await this.funcaoServiceRemove.remove(id);

    const path = req.url ?? null;

    return MensagemSistema.showMensagem(
      HttpStatus.NO_CONTENT,
      'Função excluída com sucesso!',
      null,
      path,
      null,
    );
  }
}
