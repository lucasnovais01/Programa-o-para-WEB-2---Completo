import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { AUTH } from '../constants/auth.constants';

import { AuthRequest } from '../dto/request/auth.request';
import { AuthResponse } from '../dto/response/auth.response';
import { AuthService } from '../service/auth.service';

import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';

@Controller('auth') // rota base: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK) // Login retorna 200, não 201
  @Post('login') // POST porque envia credenciais no body
  async login(
    @Req() req: Request,
    @Body() authRequest: AuthRequest, // @Body, não @Param
  ): Promise<Result<AuthResponse>> {
    const response = await this.authService.login(authRequest);

    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Login realizado com sucesso!',
      response,
      req.path,
      null,
      null, // sem HATEOAS no login
    );
  }
}
