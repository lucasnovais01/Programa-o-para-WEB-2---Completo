import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { ApiGetDoc } from '../../commons/decorators/swagger.decorators';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { CIDADE } from '../constants/cidade.constants';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceFindOne } from '../service/cidade.service.findone';
@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerFindOne {
  constructor(private readonly cidadeServiceFindOne: CidadeServiceFindOne) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.CIDADE.BY_ID)
  @ApiGetDoc(CIDADE.OPERACAO.POR_ID, CidadeResponse)
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<CidadeResponse>> {
    const response = await this.cidadeServiceFindOne.findOne(id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Cidade localizada com sucesso!',
      response,
      req.path,
      null,
    );
  }
}
