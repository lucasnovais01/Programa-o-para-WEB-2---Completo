import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { HOSPEDE } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { Page } from 'src/commons/pagination/page.sistema';
import { geraPageLinks } from 'src/commons/utils/hateoas.utils';
import { HospedeResponse } from '../dto/response/hospede.response';
import { HospedeServiceFindAll } from '../service/hospede.service.findall';

@Controller(ROTA.HOSPEDE.BASE.substring(1)) // Remove a barra inicial para evitar duplicação
export class HospedeControllerFindAll {
  constructor(private readonly hospedeServiceFindAll: HospedeServiceFindAll) {}

  @HttpCode(HttpStatus.OK) // 200
  @Get(ROTA.HOSPEDE.ENDPOINTS.LIST)
  async findAll(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('props') props?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('searchTerm') search?: string,
  ): Promise<Result<Page<HospedeResponse>>> {
    const response = await this.hospedeServiceFindAll.findAll(
      page ? Number(page) : PAGINATION.PAGE,
      pageSize ? Number(pageSize) : PAGINATION.PAGESIZE,
      props ?? 'idUsuario',
      order ?? PAGINATION.ASC,
      search,
    );
    const _link = geraPageLinks(req, response, HOSPEDE);

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Lista de hóspedes gerada com sucesso!',
      response,
      req.path,
      null,
      _link,
    );
  }
}

// http://localhost:8000/rest/sistema/v1/hospede/listar

/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.controller.findall.ts
 * ==============================================================

 * O que é?
 *   - Controller específico para a operação de FIND ALL (GET) no módulo Hospede.

 * Como funciona?
 *   1. @Controller define a base da rota (ex.: /rest/sistema/v1/hospede).
 *   2. @Get adiciona o endpoint /listar, com HTTP 200 (OK).
 *   3. Injeta HospedeServiceFindAll no constructor para chamar o service.
 *   4. Método findAll recebe @Req() (para path) e chama service.findAll.
 *   5. Retorna lista de responses via MensagemSistema (status, mensagem, dados).

 * Por quê separado?
 *   - Organização: Cada operação em arquivo próprio para clareza.
 *   - Facilita manutenção, testes e escalabilidade.

 * Dicas:
 *   - Não precisa de @Body() pois é GET sem parâmetros.
 *   - Erros são capturados pelo HttpExceptionFilter global.
 *   - Integra com ROTA para URLs padronizadas.
 *
 * ==============================================================
 */
