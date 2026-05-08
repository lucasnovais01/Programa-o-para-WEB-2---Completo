/*

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { ApiPostDoc } from '../../commons/decorators/swagger.decorators';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';
import { USUARIO } from '../constants/usuario.constants';

import { UsuarioServiceCreate } from '../service/usuario.service.create';
import { UsuarioRequest } from '../dto/request/usuario.request';
import { UsuarioResponse } from '../dto/response/usuario.response';

@ApiTags('Usuario')
@Controller(ROTA.USUARIO.BASE)
export class UsuarioControllerCreate {
  constructor(private readonly usuarioServiceCreate: UsuarioServiceCreate) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(ROTA.USUARIO.CREATE)
  @ApiPostDoc(USUARIO.OPERACAO.CRIAR, UsuarioRequest, UsuarioResponse)
  async create(
    @Req() req: Request,
    @Body() usuarioRequest: UsuarioRequest,
  ): Promise<Result<UsuarioResponse>> {
    const _link = gerarLinks(req, USUARIO.ENTITY);
    const response = await this.usuarioServiceCreate.create(usuarioRequest);
    return MensagemSistema.showMensagem(
      HttpStatus.CREATED,
      'Usuário cadastrado com sucesso!',
      response,
      req.path,
      null,
      _link,
    );
  }
}

*/
