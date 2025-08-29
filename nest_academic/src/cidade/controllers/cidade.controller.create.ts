import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeServiceCreate } from '../service/cidade.service.create';

@Controller('/cidade')
export class CidadeControllerCreate {
  constructor(private readonly cidadeServiceCreate: CidadeServiceCreate) {}

  @HttpCode(HttpStatus.CREATED) // 201
  @Post('/criar')
  create(@Body() cidadeRequest: CidadeRequest) {
    // o método POST é usado para criar novos recursos
    //return cidadeRequest; // Retorna o objeto recebido no corpo da requisição
    const response = this.cidadeServiceCreate.create(cidadeRequest);
    return response;
  }
}
