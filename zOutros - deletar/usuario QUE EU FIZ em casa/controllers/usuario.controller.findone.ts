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
import { ROTA } from '../../commons/constants/url.sistema';
import { ApiGetDoc } from '../../commons/decorators/swagger.decorators';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';

import { USUARIO } from '../constants/usuario.constants';

import { UsuarioServiceFindOne } from '../service/usuario.service.findone';
import { UsuarioResponse } from '../dto/response/usuario.response';
@Controller(ROTA.USUARIO.BASE)
export class UsuarioControllerFindOne {
  constructor(private readonly usuarioServiceFindOne: UsuarioServiceFindOne) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.USUARIO.BY_ID)
  @ApiGetDoc(USUARIO.OPERACAO.POR_ID, UsuarioResponse)
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<UsuarioResponse>> {
    const _link = gerarLinks(req, USUARIO.ENTITY, id);
    const response = await this.usuarioServiceFindOne.findOne(id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Usuário localizado com sucesso!',
      response,
      req.path,
      null,
      _link,
    );
  }
}
