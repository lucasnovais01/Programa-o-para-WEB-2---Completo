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
import { FUNCIONARIO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiPutDoc } from 'src/commons/decorators/swagger.decorators';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { FuncionarioUpdateRequest } from '../dto/request/funcionario.request';
import { FuncionarioResponse } from '../dto/response/funcionario.response';
import { FuncionarioServiceUpdate } from '../service/funcionario.service.update';

@Controller(ROTA.FUNCIONARIO.BASE.substring(1))
export class FuncionarioControllerUpdate {
  constructor(
    private readonly funcionarioServiceUpdate: FuncionarioServiceUpdate,
  ) {}

  @ApiPutDoc(
    {
      ACAO: 'Atualizar funcionário',
      SUCESSO: 'Funcionário atualizado com sucesso',
      ERRO: 'Erro ao atualizar funcionário',
      NAO_LOCALIZADO: 'Funcionário não encontrado',
    },
    FuncionarioUpdateRequest,
    FuncionarioResponse,
  )
  @HttpCode(HttpStatus.OK)
  @Put(ROTA.FUNCIONARIO.ENDPOINTS.UPDATE)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() funcionarioRequest: FuncionarioUpdateRequest,
  ): Promise<Result<FuncionarioResponse | null>> {
    const response = await this.funcionarioServiceUpdate.update(
      id,
      funcionarioRequest,
    );

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Funcionário atualizado com sucesso',
      response,
      req.path,
      null,
      gerarLinks(req, FUNCIONARIO, id),
    );
  }
}
