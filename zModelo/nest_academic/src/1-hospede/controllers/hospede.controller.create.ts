import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from 'src/commons/constants/url.sistema';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { HospedeRequest } from '../dto/request/hospede.request';
import { HospedeResponse } from '../dto/response/hospede.response';
import { HospedeServiceCreate } from '../service/hospede.service.create';

import { HOSPEDE } from 'src/commons/constants/constants.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';

@Controller(ROTA.HOSPEDE.BASE.substring(1)) // Remove a barra inicial '/' da rota
export class HospedeControllerCreate {
  constructor(private readonly hospedeServiceCreate: HospedeServiceCreate) {}
  // Define o código de status HTTP 201 (Created) para a resposta
  @HttpCode(HttpStatus.CREATED)
  // Usa o endpoint definido em ROTA.HOSPEDE.ENDPOINTS para evitar manipulações de string
  @Post(ROTA.HOSPEDE.ENDPOINTS.CREATE)
  async create(
    @Req() req: Request,
    @Body() hospedeRequest: HospedeRequest,
  ): Promise<Result<HospedeResponse>> {
    const response = await this.hospedeServiceCreate.create(hospedeRequest);
    const _link = gerarLinks(req, HOSPEDE, response?.idUsuario);

    // atualizado de (req, HOSPEDE) para (req, HOSPEDE. response?.idUsuario) por que a função gerarLinks precisa do nome da entidade no singular (HOSPEDE) e do ID para gerar os links corretamente.

    // não é HOSPEDE.ENTITY, porque a função gerarLinks espera o nome da entidade no singular,
    // e HOSPEDE.ENTITY é "hospedes" (plural)
    // a função gerarLinks fica em utils/hateoas.utils.ts, e ela gera os links com base no nome da entidade, então precisa ser no singular
    return MensagemSistema.showMensagem(
      HttpStatus.CREATED,
      'Hóspede cadastrado com sucesso!!!',
      response,
      // ROTA.HOSPEDE.CREATE, não é mais necessário porque agora usamos req.path que já tem a rota completa
      req.path,
      null,
      _link,
    );
  }
}

// http://localhost:8000/rest/sistema/v1/hospede/criar

/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.controller.create.ts
 * ==============================================================

 * O que é?
 *   - Controller específico para a operação de CREATE (POST) no módulo Hospede.

 * Como funciona?
 *   1. @Controller define a base da rota (ex.: /rest/sistema/v1/hospede).
 *   2. @Post adiciona o endpoint /criar, com HTTP 201 (Created).
 *   3. Injeta HospedeServiceCreate no constructor para chamar o service.
 *   4. Método create recebe @Body() (DTO validado) e @Req() (para path).
 *   5. Chama service.create para lógica de negócios.
 *   6. Retorna resposta padronizada via MensagemSistema (status, mensagem, dados).

 * Por quê separado?
 *   - Organização: Cada operação (create, find, etc.) em arquivo próprio.
 *   - Facilita manutenção e testes unitários.

 * Dicas:
 *   - Validação do DTO ocorre automaticamente via ValidationPipe global.
 *   - Erros (ex.: validação falha) são capturados pelo HttpExceptionFilter.
 *   - Integra com ROTA para URLs consistentes.
 * 
 * ==============================================================
 */

/*
 * ==============================================================
 * TUTORIAL: Métodos String em JavaScript/TypeScript
 * ==============================================================

 * 1. substring(1):
 * ---------------
 * - O que faz: Remove a primeira letra (ou caractere) de uma string
 * - Por que usar: Remove a barra inicial '/' das rotas
 * - Exemplo:
 *   "/rest/sistema/v1/hospede" -> "rest/sistema/v1/hospede"

 * 2. split('/'):
 * -------------
 * - O que faz: Divide uma string em array usando '/' como separador
 * - Exemplo:
 *   "/rest/sistema/v1/hospede/criar" -> ["", "rest", "sistema", "v1", "hospede", "criar"]

 * 3. pop():
 * --------
 * - O que faz: Remove e retorna o último elemento de um array
 * - Exemplo:
 *   ["", "rest", "sistema", "v1", "hospede", "criar"] -> retorna "criar"
 * 
 * 4. Combinando split('/').pop():
 * -----------------------------
 * - Pega apenas a última parte de um caminho URL
 * - Exemplo completo:
 *   ROTA.HOSPEDE.CREATE = "/rest/sistema/v1/hospede/criar"
 *   ROTA.HOSPEDE.CREATE.split('/') -> ["", "rest", "sistema", "v1", "hospede", "criar"]
 *   ROTA.HOSPEDE.CREATE.split('/').pop() -> "criar"
 * 
 * ==============================================================
 */

/*
 * ==============================================================
 * SOLUÇÃO DO PROBLEMA DE ROTAS 404
 * ==============================================================

 * O PROBLEMA:
 * ----------
 * 1. As rotas não estavam funcionando (erro 404) porque havia uma
 *    incompatibilidade na forma como o NestJS trata as barras iniciais
 *    nas rotas.

 * 2. No arquivo url.sistema.ts, as rotas são geradas com barra inicial:
 *    ROTA.HOSPEDE.BASE = "/rest/sistema/v1/hospede"
 *    ROTA.HOSPEDE.CREATE = "/rest/sistema/v1/hospede/criar"
 * 
 * 3. O NestJS espera:
 *    - @Controller: rota base SEM barra inicial
 *    - @Post: apenas o sufixo da rota

 * A SOLUÇÃO:
 * ---------
 * 1. No @Controller:
 *    - Usar ROTA.HOSPEDE.BASE.substring(1) para remover a barra inicial
 *    - Resultado: "rest/sistema/v1/hospede"
 * 
 * 2. No @Post:
 *    - Usar ROTA.HOSPEDE.CREATE.split('/').pop() para pegar só o 'criar'
 *    - Isso evita duplicação do caminho base
 * 
 * EXEMPLO DE COMO FICA:
 * -------------------
 * Base original: "/rest/sistema/v1/hospede"
 * Base processada: "rest/sistema/v1/hospede"
 * Rota POST: "criar"
 * URL final: "http://localhost:8000/rest/sistema/v1/hospede/criar"
 * 
 * LOGS DO SERVIDOR:
 * ---------------
 * [RouterExplorer] Mapped {/rest/sistema/v1/hospede/criar, POST} route
 * 
 * IMPORTANTE:
 * ----------
 * 1. Esta solução mantém a estrutura de ROTA do professor
 * 2. Não precisamos mudar a lógica de geração de rotas
 * 3. Apenas adaptamos como o controller usa essas rotas
 * 4. Os logs mostram que a rota está corretamente registrada
 * 
 * ==============================================================
 */
