import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeServiceCreate } from '../service/cidade.service.create';
import { ROTA } from 'src/commons/constants/url.sistema';
import { CidadeResponse } from '../dto/response/cidade.response';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import type { Request } from 'express';
import { Result } from 'src/commons/mensagem/mensagem';
import {
  ApiConsumes,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Import novo do 5º SEMESTRE, assim comoo os @Api
import { CIDADE } from '../constants/cidade.constants';

@ApiTags(CIDADE.ENTITY)
//
//
@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerCreate {
  constructor(private readonly cidadeServiceCreate: CidadeServiceCreate) {}

  @HttpCode(HttpStatus.CREATED) // 201
  @Post(ROTA.CIDADE.CREATE)
  //
  //
  // novo semestre:
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: CIDADE.OPERACAO.CRIAR.SUCESSO,
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')

  // Explicação: Independente da linguagem, é o swagger.

  // Semestre passado:
  //
  //
  async create(
    @Req() res: Request,
    @Body() cidadeRequest: CidadeRequest,
  ): Promise<Result<CidadeResponse>> {
    const response = await this.cidadeServiceCreate.create(cidadeRequest);
    return MensagemSistema.showMensagem(
      HttpStatus.CREATED,
      'Cidade cadastrada com sucesso!!!',
      response,
      res.path,
      null,
    );
  }
}

// http://localhost:8000/rest/sistema/cidade/criar

/*
create(@Body() cidadeRequest: CidadeRequest) {
  // o método POST é usado para criar novos recursos
  //return cidadeRequest; // Retorna o objeto recebido no corpo da requisição
  const response = await this.cidadeServiceCreate.create(cidadeRequest);
  return response;
}
*/
