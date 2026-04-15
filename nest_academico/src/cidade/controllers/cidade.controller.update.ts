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
import { CIDADE } from '../constants/cidade.constants';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceUpdate } from '../service/cidade.service.update';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerUpdate {
  constructor(private readonly cidadeServiceUpdate: CidadeServiceUpdate) {}

  @HttpCode(HttpStatus.OK)
  @Put(ROTA.CIDADE.UPDATE)
  @ApiPutDoc(CIDADE.OPERACAO.ATUALIZAR, CidadeRequest, CidadeResponse)
  async update(
    @Req() res: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() cidadeRequest: CidadeRequest,
  ): Promise<Result<CidadeResponse>> {
    const response = await this.cidadeServiceUpdate.update(id, cidadeRequest);
    const _link = gerarLinks(res, CIDADE.ENTITY, id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Cidade alterada com sucesso !',
      response,
      res.path,
      null,
      _link,
    );
  }
}
