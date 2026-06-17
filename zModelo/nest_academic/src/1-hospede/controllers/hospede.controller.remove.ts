import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { HOSPEDE } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { HospedeServiceRemove } from '../service/hospede.service.remove';

import type { Request } from 'express';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';

@Controller(ROTA.HOSPEDE.BASE.substring(1)) // Remove a barra inicial para evitar duplicação
export class HospedeControllerRemove {
  constructor(private readonly hospedeServiceRemove: HospedeServiceRemove) {}

  // Retornar 204 é o mais apropriado para delete sem corpo
  @HttpCode(HttpStatus.NO_CONTENT) //O correto é o NO_CONTENT, foi trocado (HttpStatus.OK)

  // Histórico: @Delete(ROTA.HOSPEDE.DELETE) foi comentado porque quando
  // BY_ID incluía a rota completa causava duplicação com o @Controller base.
  // Agora temos ENDPOINTS no ROTA, então usamos:
  @Delete(ROTA.HOSPEDE.ENDPOINTS.DELETE) // 'excluir/:id'
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<void>> {
    await this.hospedeServiceRemove.remove(id);
    const _link = gerarLinks(req, HOSPEDE, id);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const rawPath =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (req as any).path ?? (req as any).url ?? (req as any).originalUrl;
    const path: string | null = typeof rawPath === 'string' ? rawPath : null;

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Hóspede excluído com sucesso!',
      null,
      path,
      null,
      _link,
    );
  }
}

// http://localhost:8000/rest/sistema/v1/hospede/excluir/:id

/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.controller.remove.ts
 * ==============================================================

 * O que é?
 *   - Controller específico para a operação de REMOVE (DELETE por ID) no módulo Hospede.

 * Como funciona?
 *   1. @Controller define a base da rota (ex.: /rest/sistema/v1/hospede).
 *   2. @Delete adiciona o endpoint /excluir/:id, com HTTP 204 (No Content).
 *   3. Injeta HospedeServiceRemove no constructor para chamar o service.
 *   4. Método remove recebe @Param('id') (validado como número via ParseIntPipe) e @Req() (para path).
 *   5. Chama service.remove para deletar por ID.
 *   6. Retorna resposta vazia via MensagemSistema (status 204, mensagem, null para dados).

 * Por quê separado?
 *   - Organização: Cada operação em arquivo próprio para clareza.
 *   - Facilita manutenção, testes e escalabilidade.

 * Dicas:
 *   - 204 No Content: Padrão para deletes sem retorno de corpo.
 *   - ParseIntPipe garante :id numérico; lança erro se inválido.
 *   - Erros (ex.: não encontrado) são lançados no service e capturados pelo filter global.
 *   - Integra com ROTA para URLs padronizadas.
 *
 * ==============================================================
 */
