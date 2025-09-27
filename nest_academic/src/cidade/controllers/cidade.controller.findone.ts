import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { CidadeServiceFindOne } from '../service/cidade.service.findone';
import { ROTA } from 'src/commons/constants/url.sistema';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import type { Request } from 'express';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerFindOne {
  constructor(private readonly cidadeServiceFindOne: CidadeServiceFindOne) {}

  @HttpCode(HttpStatus.OK) // 200
  @Get(ROTA.CIDADE.BY_ID)
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<CidadeResponse | null>> {
    const response = await this.cidadeServiceFindOne.findById(+id);

    return MensagemSistema.showMessage(
      HttpStatus.OK,
      'Cidade localizada com sucesso!',
      response,
      req.path,
      null,
    );
  }
}
/*
findOne(@Param('id', ParseIntPipe) id: number) {
  const cidade = this.cidadeServiceFindOne.findOne(+id);
  return cidade;
}
*/

// http://localhost:8000/cidade/listar/1
