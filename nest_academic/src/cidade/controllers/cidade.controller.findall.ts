import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceFindAll } from '../service/cidade.service.findall';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerFindAll {
  constructor(private readonly cidadeServiceFindAll: CidadeServiceFindAll) {}

  @HttpCode(HttpStatus.OK)
  @Get(ROTA.CIDADE.LIST)
  async findAll(@Req() req: Request): Promise<Result<CidadeResponse[]>> {
    const response = await this.cidadeServiceFindAll.findAll();
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Lista de cidade gerada com sucesso!',
      response,
      req.path,
      null,
    );
  }
}
