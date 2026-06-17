import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from 'src/commons/constants/url.sistema';
import { ApiDeleteDoc } from 'src/commons/decorators/swagger.decorators';
import { Result } from 'src/commons/mensagem/mensagem';
import { MensagemSistema } from 'src/commons/mensagem/mensagem.sistema';
import { FuncionarioServiceRemove } from '../service/funcionario.service.remove';

@Controller(ROTA.FUNCIONARIO.BASE.substring(1))
export class FuncionarioControllerRemove {
  constructor(
    private readonly funcionarioServiceRemove: FuncionarioServiceRemove,
  ) {}

  @ApiDeleteDoc({
    ACAO: 'Excluir funcionário',
    SUCESSO: 'Funcionário excluído com sucesso',
    NAO_LOCALIZADO: 'Funcionário não encontrado',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(ROTA.FUNCIONARIO.ENDPOINTS.DELETE)
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<null>> {
    await this.funcionarioServiceRemove.remove(id);

    return MensagemSistema.showMensagem(
      HttpStatus.NO_CONTENT,
      'Funcionário removido com sucesso',
      null,
      req.path,
      null,
    );
  }
}
