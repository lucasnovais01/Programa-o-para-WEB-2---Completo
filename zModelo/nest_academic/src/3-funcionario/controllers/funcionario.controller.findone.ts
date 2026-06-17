import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { FUNCIONARIO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiGetDoc } from 'src/commons/decorators/swagger.decorators';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { FuncionarioResponse } from '../dto/response/funcionario.response';
import { FuncionarioServiceFindOne } from '../service/funcionario.service.findone';

@Controller(ROTA.FUNCIONARIO.BASE.substring(1))
export class FuncionarioControllerFindOne {
  constructor(
    private readonly funcionarioServiceFindOne: FuncionarioServiceFindOne,
  ) {}

  @ApiGetDoc(
    {
      ACAO: 'Buscar funcionário por ID',
      SUCESSO: 'Funcionário recuperado com sucesso',
      NAO_LOCALIZADO: 'Funcionário não encontrado',
    },
    FuncionarioResponse,
  )
  @HttpCode(HttpStatus.OK)
  @Get(ROTA.FUNCIONARIO.ENDPOINTS.BY_ID)
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<FuncionarioResponse>> {
    const response = await this.funcionarioServiceFindOne.findOne(id);

    if (!response) {
      throw new HttpException(
        'Funcionário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Funcionário recuperado com sucesso',
      response,
      req.path,
      null,
      gerarLinks(req, FUNCIONARIO, id),
    );
  }
}
