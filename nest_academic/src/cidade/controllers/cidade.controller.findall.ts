import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { CidadeServiceFindAll } from '../service/cidade.service.findall';
import { ROTA } from 'src/commons/constants/url.sistema';
import { CidadeResponse } from '../dto/response/cidade.response';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { Result } from 'src/commons/mensagem/mensagem';
import type { Request } from 'express';

@Controller(ROTA.CIDADE.BASE)
//PascalCamel
export class CidadeControllerFindAll {
  constructor(private readonly cidadeServiceFindAll: CidadeServiceFindAll) {}

  @HttpCode(HttpStatus.OK) // 200
  @Get(ROTA.CIDADE.LIST)
  async findAll(@Req() res: Request): Promise<Result<CidadeResponse[]>> {
    const response = await this.cidadeServiceFindAll.findAll();

    return MensagemSistema.showMessage(
      HttpStatus.OK,
      'Lista de cidade gerada com sucesso!',
      response,
      res.path,
      null,
    );
  }
}

// http://localhost:8000/cidade/listar
