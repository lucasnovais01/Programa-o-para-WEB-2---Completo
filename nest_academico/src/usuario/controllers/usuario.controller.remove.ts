/*

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
import { gerarLinks } from '../../commons/utils/hateoas.utils';

import { USUARIO } from '../constants/usuario.constants';
import { UsuarioServiceRemove } from '../service/usuario.service.remove';

@Controller(ROTA.USUARIO.BASE)
export class UsuarioControllerRemove {
  constructor(private readonly usuarioServiceRemove: UsuarioServiceRemove) {}

  @HttpCode(HttpStatus.OK) //NO_CONTENT
  @Delete(ROTA.USUARIO.DELETE)
  async remove(
    @Req() res: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<void>> {
    const _link = gerarLinks(res, USUARIO.ENTITY);
    await this.usuarioServiceRemove.remove(id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Usuário excluído com sucesso!',
      null,
      res.path,
      null,
      _link,
    );
  }
}

*/
