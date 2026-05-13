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
import { ROTA } from '../../commons/constants/url.sistema';
import { ApiPutDoc } from '../../commons/decorators/swagger.decorators';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';

import { USUARIO } from '../constants/usuario.constants';

import { UsuarioServiceUpdate } from '../service/usuario.service.update';
import { UsuarioRequest } from '../dto/request/usuario.request';
import { UsuarioResponse } from '../dto/response/usuario.response';

@Controller(ROTA.USUARIO.BASE)
export class UsuarioControllerUpdate {
  constructor(private readonly usuarioServiceUpdate: UsuarioServiceUpdate) {}

  @HttpCode(HttpStatus.OK)
  @Put(ROTA.USUARIO.UPDATE)
  @ApiPutDoc(USUARIO.OPERACAO.ATUALIZAR, UsuarioRequest, UsuarioResponse)
  async update(
    @Req() res: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() usuarioRequest: UsuarioRequest,
  ): Promise<Result<UsuarioResponse>> {
    const response = await this.usuarioServiceUpdate.update(id, usuarioRequest);
    const _link = gerarLinks(res, USUARIO.ENTITY, id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Usuário alterado com sucesso !',
      response,
      res.path,
      null,
      _link,
    );
  }
}
