import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { FUNCAO } from 'src/commons/constants/constants.sistema';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiGetDoc } from 'src/commons/decorators/swagger.decorators';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { gerarLinks } from 'src/commons/utils/hateoas.utils';
import { FuncaoConverter } from '../dto/converter/funcao.converter';
import { FuncaoResponse } from '../dto/response/funcao.response';
import { FuncaoServiceFindOne } from '../service/funcao.service.findone';

@Controller(ROTA.FUNCAO.BASE.substring(1))
export class FuncaoControllerFindOne {
  constructor(private readonly funcaoServiceFindOne: FuncaoServiceFindOne) {}

  @ApiGetDoc(
    {
      ACAO: 'Buscar função por código',
      SUCESSO: 'Função localizada com sucesso',
      NAO_LOCALIZADO: 'Função não encontrada',
    },
    FuncaoResponse,
  )
  @HttpCode(HttpStatus.OK)
  @Get(ROTA.FUNCAO.ENDPOINTS.BY_ID)
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<FuncaoResponse | null>> {
    const entidade = await this.funcaoServiceFindOne.findByCodigo(+id);
    const response = FuncaoConverter.toFuncaoResponse(entidade);

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Função localizada com sucesso!',
      response,
      ROTA.FUNCAO.BY_ID,
      null,
      response?.codigoFuncao
        ? gerarLinks(req, FUNCAO, response.codigoFuncao)
        : gerarLinks(req, FUNCAO),
    );
  }
}
