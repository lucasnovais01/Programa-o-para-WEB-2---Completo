import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { HospedeServiceFindOne } from '../service/hospede.service.findone';

import { ConverterHospede } from '../dto/converter/hospede.converter'; // novo

import type { Request } from 'express';
import { HOSPEDE } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { HospedeResponse } from '../dto/response/hospede.response';

@Controller(ROTA.HOSPEDE.BASE.substring(1)) // Remove a barra inicial para evitar duplicação
export class HospedeControllerFindOne {
  constructor(private readonly hospedeServiceFindOne: HospedeServiceFindOne) {}

  @HttpCode(HttpStatus.OK) // 200
  // Usa o endpoint do ROTA para preservar a palavra 'buscar' sem duplicar a base
  // Histórico: em tentativas anteriores usamos .split('/').pop() (isso removia 'buscar')
  // @Get(ROTA.HOSPEDE.BY_ID)  // isso causava duplicação quando BY_ID era a rota completa
  @Get(ROTA.HOSPEDE.ENDPOINTS.BY_ID)
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<HospedeResponse | null>> {
    // trocado (antes era):
    // const response = await this.hospedeServiceFindOne.findById(+id);

    const entidade = await this.hospedeServiceFindOne.findById(+id);

    // Converte entidade para DTO de response antes de enviar ao cliente.
    const response = ConverterHospede.toHospedeResponse(entidade);
    const _link = gerarLinks(req, HOSPEDE, id);

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Hóspede localizado com sucesso!',
      response,
      req.path,
      null,
      _link,
    );
  }
}

// http://localhost:8000/rest/sistema/v1/hospede/buscar/:id

/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.controller.findone.ts
 * ==============================================================

 * O que é?
 *   - Controller específico para a operação de FIND ONE (GET por ID) no módulo Hospede.

 * Como funciona?
 *   1. @Controller define a base da rota (ex.: /rest/sistema/v1/hospede).
 *   2. @Get adiciona o endpoint /buscar/:id, com HTTP 200 (OK).
 *   3. Injeta HospedeServiceFindOne no constructor para chamar o service.
 *   4. Método findOne recebe @Param('id') (validado como número via ParseIntPipe) e @Req() (para path).
 *   5. Chama service.findById para buscar por ID.
 *   6. Retorna response via MensagemSistema (status, mensagem, dados ou null).
 * 
 * Por quê separado?
 *   - Organização: Cada operação em arquivo próprio para clareza.
 *   - Facilita manutenção, testes e escalabilidade.
 * 
 * Dicas:
 *   - ParseIntPipe garante que :id seja número; lança erro se inválido.
 *   - Se não encontrado, service pode retornar null; filter global cuida de erros.
 *   - Integra com ROTA para URLs padronizadas.
 * 
 * ==============================================================
 */

/* 
  * ==============================================================
  Problema de duplicação de rota com o uso de ROTA.HOSPEDE.BY_ID

  A Constante ROTA.HOSPEDE.BASE contém a rota base completa: "/rest/sistema/v1/hospede".
Sua constante do método (ex.: ROTA.HOSPEDE.BY_ID) também foi gerada como a rota completa ("/rest/sistema/v1/hospede/buscar/:id").
Quando você usa @Controller(ROTA.HOSPEDE.BASE) e também @Get(ROTA.HOSPEDE.BY_ID), o Nest concatena o base do controller com o path do método — resultando na duplicação: "/rest/sistema/v1/hospede/rest/sistema/v1/hospede/buscar/:id".
O uso de .split('/').pop() em cima de uma string como "/rest/sistema/v1/hospede/buscar/:id" pega só o último segmento (":id" ou "id"), então o método passou a registrar somente "/:id" sob a base do controller, daí você viu "/rest/sistema/v1/hospede/:id" (ou "…/id" no log). Por isso a palavra "buscar" desapareceu.
Por que o Nest “concatena” e gera duplicação

Nest resolve rotas combinando a string do @Controller() com a do decorator do método.
Ex.: @Controller('cats') + @Get('list') => /cats/list
Se o decorator de método contém a rota inteira (começando por "/rest/…"), Nest ainda concatena com a base do controller — não faz “detecção inteligente” para evitar repetição — então você obtém /base/fullpath.
Portanto a regra prática: ou você dá a base no @Controller e só o sufixo nos métodos; ou não define base no controller e usa o caminho completo nos métodos. Misturar os dois (ambos com a mesma base) causa duplicação.
Por que .split('/').pop() tirou a palavra "buscar"

Exemplo: "/rest/sistema/v1/hospede/buscar/:id".split('/') => ["", "rest", "sistema", "v1", "hospede", "buscar", ":id"]
.pop() retorna o último elemento: ":id" (ou "id" se você removeu os dois-pontos).
Ao usar @Get(ROTA… .split('/').pop()) o decorator virou só ":id" => o Nest logou /base/:id. A parte "buscar" desapareceu porque você descartou todos os segmentos anteriores.
Como evitar isso (boas práticas / opções)

Padrão “base no controller, sufixo nos métodos” (recomendado)

@Controller(ROTA.HOSPEDE.BASE) (ou ROTA.HOSPEDE.BASE.substring(1) se você gera com "/" no começo)
@Get(ROTA.HOSPEDE.LIST.split('/').pop()) para rotas sem parâmetro (ou melhor: exporte um ENDPOINT constant LIST_ENDPOINT = 'listar').
Para rotas com parâmetro, NÃO usar .pop() — use o sufixo completo: @Get('buscar/:id') (ou providencie BY_ID_ENDPOINT = 'buscar/:id').
Vantagem: claro, consistente com o professor, fácil mudar a base em um único lugar.
Padrão “método com rota completa, controller sem base” (alternativa)

@Controller() (vazio) e nos métodos usar @Get(ROTA.HOSPEDE.BY_ID) — onde ROTA.HOSPEDE.BY_ID já é "/rest/sistema/v1/hospede/buscar/:id".
Vantagem: usa as rotas completas diretamente; cuidado para não duplicar se também usar app.setGlobalPrefix.
Se quiser manter ROTA como está (rota completa), então:

Não combine @Controller(ROTA.HOSPEDE.BASE) com @Get(ROTA.HOSPEDE.BY_ID) — porque ambos têm a base.
Ou modifique ROTA para exportar também os "endpoints" separados (por exemplo ENDPOINTS = { LIST: 'listar', BY_ID: 'buscar/:id' }) e use estes nos decorators de método.
*/

/*
Notas sobre app.setGlobalPrefix(...)

Se você usa app.setGlobalPrefix('rest/sistema/v1') e também inclui esse prefixo nas ROTA, você também pode acabar com prefixo duplicado. No seu caso foi parte da depuração anterior — agora que o setGlobalPrefix foi removido, ainda precisa só evitar repetir a parte base nas ROTA + @Controller.
*/
