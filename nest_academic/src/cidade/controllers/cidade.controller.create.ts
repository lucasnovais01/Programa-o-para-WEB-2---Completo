import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { ApiPostDoc } from '../../commons/decorators/swagger.decorators';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';
import { CIDADE } from '../constants/cidade.constants';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceCreate } from '../service/cidade.service.create';

@ApiTags('Cidade')
@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerCreate {
  constructor(private readonly cidadeServiceCreate: CidadeServiceCreate) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(ROTA.CIDADE.CREATE)
  @ApiPostDoc(CIDADE.OPERACAO.CRIAR, CidadeRequest, CidadeResponse)
  async create(
    @Req() req: Request,
    @Body() cidadeRequest: CidadeRequest,
  ): Promise<Result<CidadeResponse>> {
    const _link = gerarLinks(req, CIDADE.ENTITY);
    const response = await this.cidadeServiceCreate.create(cidadeRequest);
    return MensagemSistema.showMensagem(
      HttpStatus.CREATED,
      'Cidade cadastrada com sucesso!',
      response,
      req.path,
      null,
      _link,
    );
  }
}
