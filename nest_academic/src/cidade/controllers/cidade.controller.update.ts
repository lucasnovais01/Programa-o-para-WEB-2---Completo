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
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeServiceUpdate } from '../service/cidade.service.update';
import { ROTA } from 'src/commons/constants/url.sistema';
import type { Request } from 'express';
import { Result } from 'src/commons/mensagem/mensagem';
import { CidadeResponse } from '../dto/response/cidade.response';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerUpdate {
  constructor(private readonly cidadeServiceUpdate: CidadeServiceUpdate) {}

  @HttpCode(HttpStatus.OK)
  @Put(ROTA.CIDADE.UPDATE) // o método PUT envia o objeto a ser persistido, a ser modificado
  async update(
    @Req() res: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() cidadeRequest: CidadeRequest,
  ): Promise<Result<CidadeResponse>> {
    const response = await this.cidadeServiceUpdate.update(id, cidadeRequest);
    return MensagemSistema.showMessage(
      HttpStatus.OK,
      'A cidade foi alterada com sucesso !',
      response,
      res.path,
      null,
    );
  }
  /*
    /rest/sistema/cidade/alterar/:id, PUT


  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() cidadeRequest: CidadeRequest,
  ) {
    // console.log("recebendo o id " + id);
    const response = this.cidadeServiceUpdate.update(id, cidadeRequest);
    return response;
  }
  
  */
}
