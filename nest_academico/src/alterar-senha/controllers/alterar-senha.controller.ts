import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Put, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';
import { AlterarSenhaRequest } from '../dto/request/alterar-senha.request';
import { AlterarSenhaResponse } from '../dto/response/alterar-senha.response';
import { AlterarSenhaService } from '../service/alterar-senha.service';

@Controller(ROTA.ALTERAR_SENHA.BASE)
export class AlterarSenhaController {
  constructor(private readonly alterarSenhaService: AlterarSenhaService) {}

  @HttpCode(HttpStatus.OK)
  @Put(ROTA.ALTERAR_SENHA.ALTERAR)
  async alterarSenha(
    @Req() res: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() alterarSenhaRequest: AlterarSenhaRequest,
  ): Promise<Result<AlterarSenhaResponse>> {
    const response = await this.alterarSenhaService.alterarSenha(id, alterarSenhaRequest);
    const _link = gerarLinks(res, 'alterar-senha', id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Senha alterada com sucesso !',
      response,
      res.path,
      null,
      _link,
    );
  }
}