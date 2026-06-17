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
import { FUNCAO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiPutDoc } from 'src/commons/decorators/swagger.decorators';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { FuncaoRequest } from '../dto/request/funcao.request';
import { FuncaoResponse } from '../dto/response/funcao.response';
import { FuncaoServiceUpdate } from '../service/funcao.service.update';

@Controller(ROTA.FUNCAO.BASE.substring(1))
export class FuncaoControllerUpdate {
  constructor(private readonly funcaoServiceUpdate: FuncaoServiceUpdate) {}

  @ApiPutDoc(
    {
      ACAO: 'Atualizar função',
      SUCESSO: 'Função alterada com sucesso',
      ERRO: 'Erro ao alterar função',
      NAO_LOCALIZADO: 'Função não encontrada',
    },
    FuncaoRequest,
    FuncaoResponse,
  )
  @HttpCode(HttpStatus.OK)
  @Put(ROTA.FUNCAO.ENDPOINTS.UPDATE)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() funcaoRequest: FuncaoRequest,
  ): Promise<Result<FuncaoResponse>> {
    const response = await this.funcaoServiceUpdate.update(id, funcaoRequest);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Função alterada com sucesso!',
      response,
      ROTA.FUNCAO.UPDATE,
      null,
      gerarLinks(req, FUNCAO, id),
    );
  }
}
