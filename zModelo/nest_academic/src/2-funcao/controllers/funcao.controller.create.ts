import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { FUNCAO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiPostDoc } from 'src/commons/decorators/swagger.decorators';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { FuncaoRequest } from '../dto/request/funcao.request';
import { FuncaoResponse } from '../dto/response/funcao.response';
import { FuncaoServiceCreate } from '../service/funcao.service.create';

@Controller(ROTA.FUNCAO.BASE.substring(1))
export class FuncaoControllerCreate {
  constructor(private readonly funcaoServiceCreate: FuncaoServiceCreate) {}

  @ApiPostDoc(
    {
      ACAO: 'Criar função',
      SUCESSO: 'Função cadastrada com sucesso',
      ERRO: 'Erro ao cadastrar função',
    },
    FuncaoRequest,
    FuncaoResponse,
  )
  @HttpCode(HttpStatus.CREATED)
  @Post(ROTA.FUNCAO.ENDPOINTS.CREATE)
  async create(
    @Req() req: Request,
    @Body() funcaoRequest: FuncaoRequest,
  ): Promise<Result<FuncaoResponse>> {
    const response = await this.funcaoServiceCreate.create(funcaoRequest);

    if (!response) {
      throw new HttpException(
        'Erro ao cadastrar função',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const codigoFuncao = response.codigoFuncao;

    return MensagemSistema.showMensagem(
      HttpStatus.CREATED,
      'Função cadastrada com sucesso!',
      response,
      ROTA.FUNCAO.CREATE,
      null,
      gerarLinks(req, FUNCAO, codigoFuncao),
    );
  }
}
