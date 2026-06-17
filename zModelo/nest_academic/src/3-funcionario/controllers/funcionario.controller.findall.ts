import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { FUNCIONARIO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiListDoc } from 'src/commons/decorators/swagger.decorators';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { Page } from 'src/commons/pagination/page.sistema';
import { geraPageLinks } from 'src/commons/utils/hateoas.utils';
import { FuncionarioResponse } from '../dto/response/funcionario.response';
import { FuncionarioServiceFindAll } from '../service/funcionario.service.findall';

@Controller(ROTA.FUNCIONARIO.BASE.substring(1))
export class FuncionarioControllerFindAll {
  constructor(
    private readonly funcionarioServiceFindAll: FuncionarioServiceFindAll,
  ) {}

  @ApiListDoc(
    {
      ACAO: 'Listar funcionários',
      SUCESSO: 'Lista de funcionários retornada com sucesso',
      ERRO: 'Erro ao listar funcionários',
    },
    FuncionarioResponse,
  )
  @HttpCode(HttpStatus.OK)
  @Get(ROTA.FUNCIONARIO.ENDPOINTS.LIST)
  async findAll(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('props') props?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('searchTerm') search?: string,
  ): Promise<Result<Page<FuncionarioResponse>>> {
    const response = await this.funcionarioServiceFindAll.findAll(
      page ? Number(page) : PAGINATION.PAGE,
      pageSize ? Number(pageSize) : PAGINATION.PAGESIZE,
      props ?? 'nomeLogin',
      order ?? PAGINATION.ASC,
      search,
    );

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Lista de funcionários gerada com sucesso!',
      response,
      req.path,
      null,
      geraPageLinks(req, response, FUNCIONARIO),
    );
  }
}

// Na linha 17, o erro que está dando é 'req' is declared but its value is never read.ts(6133)
