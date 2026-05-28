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

import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../config/guard/local.auth.guard';
import type RequestWithUser from '../config/requestWithUser.interface';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/session/login')
  async login(@Req() req: RequestWithUser) {
    //console.log(req.user);
    // console.log(req.user);
    //const accessToken = await this.authService.getAccessJwtToken(req.user);
    //const refreshToken = await this.authService.getRefreshJwtToken(req.user);
    // Usaremos Access Token e Refresh Token, só para aprendizado, não é assim que coloca na forma final
    // return 'Access Token = ' + accessToken + ' Refresh Token ' + refreshToken; //JSON.stringify(req.user);

    const { cookie, accessToken } = await this.authService.getJwtAccessToken(
      req.user,
    );

    req.res?.setHeader('Set-Cookie', [cookie, accessToken]);

    return 'cookie processado';
  }
}
