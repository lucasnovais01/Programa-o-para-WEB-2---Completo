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
import { ROTA } from '../../commons/constants/url.sistema';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { CidadeServiceRemove } from '../service/cidade.service.remove';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { CIDADE } from '../constants/cidade.constants';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerRemove {
  constructor(private readonly cidadeServiceRemove: CidadeServiceRemove) {}

  @HttpCode(HttpStatus.OK) //NO_CONTENT
  @Delete(ROTA.CIDADE.DELETE)
  async remove(
    @Req() res: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<void>> {
    const _link = gerarLinks(res, CIDADE.ENTITY);

    await this.cidadeServiceRemove.remove(id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Cidade excluída com sucesso!',
      null,
      res.path,
      null,
      _link,
    );
  }
}
