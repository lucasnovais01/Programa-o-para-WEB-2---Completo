import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeServiceUpdate } from '../service/cidade.service.update';

@Controller('/cidade')
export class CidadeControllerUpdate {
  constructor(private readonly cidadeServiceUpdate: CidadeServiceUpdate) {}

  @HttpCode(HttpStatus.OK)
  @Put('/alterar/:id')
  // o método PUT envia o objeto a ser persistido, a ser modificado
  update(@Param('id') id: string, @Body() cidadeRequest: CidadeRequest) {
    console.log('recebendo o id ' + id);
    const response = this.cidadeServiceUpdate.update(id, cidadeRequest);
    return response;
  }
}
