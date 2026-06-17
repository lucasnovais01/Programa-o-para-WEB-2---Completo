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
import { HOSPEDE } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { HospedeRequest } from '../dto/request/hospede.request';
import { HospedeResponse } from '../dto/response/hospede.response';
import { HospedeServiceUpdate } from '../service/hospede.service.update';

@Controller(ROTA.HOSPEDE.BASE.substring(1)) // Remove a barra inicial para evitar duplicação
export class HospedeControllerUpdate {
  constructor(private readonly hospedeServiceUpdate: HospedeServiceUpdate) {}

  @HttpCode(HttpStatus.OK)
  // Histórico: havia uma tentativa de usar a rota completa diretamente:
  // @Put(ROTA.HOSPEDE.UPDATE) // isso pode duplicar a base se a rota já contém o base
  // Solução atual: usar o endpoint definido em ROTA.HOSPEDE.ENDPOINTS
  @Put(ROTA.HOSPEDE.ENDPOINTS.UPDATE) // 'alterar/:id'
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() hospedeRequest: HospedeRequest,
  ): Promise<Result<HospedeResponse>> {
    const response = await this.hospedeServiceUpdate.update(id, hospedeRequest);
    const _link = gerarLinks(req, HOSPEDE, id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'O hóspede foi alterado com sucesso !',
      response,
      req.path,
      null,
      _link,
    );
  }
  /*
    /rest/sistema/v1/hospede/alterar/:id, PUT
  */
}

// http://localhost:8000/rest/sistema/v1/hospede/alterar/:id

/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.controller.update.ts
 * ==============================================================

 * O que é?
 *   - Controller específico para a operação de UPDATE (PUT por ID) no módulo Hospede.

 * Como funciona?
 *   1. @Controller define a base da rota (ex.: /rest/sistema/v1/hospede).
 *   2. @Put adiciona o endpoint /alterar/:id, com HTTP 200 (OK).
 *   3. Injeta HospedeServiceUpdate no constructor para chamar o service.
 *   4. Método update recebe @Param('id') (validado como número via ParseIntPipe), @Body() (DTO validado) e @Req() (para path).
 *   5. Chama service.update para atualizar por ID com novos dados.
 *   6. Retorna response atualizada via MensagemSistema (status, mensagem, dados).

 * Por quê separado?
 *   - Organização: Cada operação em arquivo próprio para clareza.
 *   - Facilita manutenção, testes e escalabilidade.

 * Dicas:
 *   - PUT para atualizações completas; DTO valida os dados de entrada.
 *   - ParseIntPipe garante :id numérico; lança erro se inválido.
 *   - Erros (ex.: não encontrado) são lançados no service e capturados pelo filter global.
 *   - Integra com ROTA para URLs padronizadas.

 * ==============================================================
 */

/*
agora o log mostra exatamente o problema: o TypeORM está tentando fazer um INSERT em vez de UPDATE. 
Vejo que o Object.assign não está mantendo o idUsuario. Vou ajustar o ConverterHospede.toHospede para preservar o 
ID quando estiver fazendo update
*/
