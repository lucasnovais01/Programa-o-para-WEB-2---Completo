import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { FUNCIONARIO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiPostDoc } from 'src/commons/decorators/swagger.decorators';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { FuncionarioRequest } from '../dto/request/funcionario.request';
import { FuncionarioResponse } from '../dto/response/funcionario.response';
import { FuncionarioServiceCreate } from '../service/funcionario.service.create';

@Controller(ROTA.FUNCIONARIO.BASE.substring(1))
export class FuncionarioControllerCreate {
  constructor(
    private readonly funcionarioServiceCreate: FuncionarioServiceCreate,
  ) {}

  @ApiPostDoc(
    {
      ACAO: 'Criar funcionário',
      SUCESSO: 'Funcionário cadastrado com sucesso',
      ERRO: 'Erro ao cadastrar funcionário',
    },
    FuncionarioRequest,
    FuncionarioResponse,
  )
  @HttpCode(HttpStatus.CREATED)
  @Post(ROTA.FUNCIONARIO.ENDPOINTS.CREATE)
  async create(
    @Req() req: Request,
    @Body() funcionarioRequest: FuncionarioRequest,
  ): Promise<Result<FuncionarioResponse>> {
    const response =
      await this.funcionarioServiceCreate.create(funcionarioRequest);
    const idUsuario = response?.idUsuario;

    return MensagemSistema.showMensagem(
      HttpStatus.CREATED,
      'Funcionário cadastrado com sucesso!',
      response,
      ROTA.FUNCIONARIO.CREATE,
      null,
      gerarLinks(req, FUNCIONARIO, idUsuario),
    );
  }
}
