// Professor disse que aqui possi um erro, chato, vai dar tal problema.
// Para acha o erro.

// O erro está aqui.
// req.res?.setHeader('Set-Cookie', [cookie, accessToken]);
// O setHeader está recebendo [cookie, accessToken], mas:

// cookie = é a string do cookie HTTP-only (formato Refresh=...; HttpOnly; Path=/)
// accessToken = é o token JWT em si, uma string pura como eyJhbGc...
// O Access Token não é um cookie, não tem o formato correto para ser setado no header Set-Cookie. Ele seria rejeitado/ignorado pelo navegador.

// Correto
// req.res?.setHeader('Set-Cookie', cookie); // só o cookie formatado
// return {
//  accessToken,  // access token vai no BODY da resposta
//  ... };

import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsuarioService } from '../../usuario/service/usuario.service';
import { LocalAuthGuard } from '../config/guard/local.auth.guard';

import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { AuthService } from '../service/auth.service';
// import type RequestWithUser from '../config/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/session/login')
  /*
  async login(@Req() req: RequestWithUser) {
    //console.log(req.user);
    const { cookie, accessToken } = await this.authService.getJwtAccessToken(
      req.user,
    );

    req.res?.setHeader('Set-Cookie', [cookie, accessToken]);

    return 'cookie processado';
  */
  async login(@Req() req: Request) {
    const usuario = req.user as Usuario;
    console.log('[DEBUG][AuthController] login start', {
      emailUsuario: usuario.emailUsuario,
      idUsuario: usuario.idUsuario,
    });

    const { accessToken, expireInAccessToken } =
      await this.authService.getJwtAccessToken({
        idUsuario: usuario.idUsuario,
      } as any);

    console.log('[DEBUG][AuthController] login token generated', {
      accessToken,
      expiresIn: expireInAccessToken,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: expireInAccessToken,
      usuario: {
        idUsuario: usuario.idUsuario,
        nomeUsuario: usuario.nomeUsuario,
        sobrenomeUsuario: usuario.sobrenomeUsuario,
        emailUsuario: usuario.emailUsuario,
      },
    };
  }

  // Precisa do Get e vai conversar com src\auth\config\guard\google.auth.guard.ts

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth() {}
}
