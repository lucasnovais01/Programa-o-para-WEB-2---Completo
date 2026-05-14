import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import type RequestWithUser from '../config/requestWithUser.interface';
import { LocalAuthGuard } from '../guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {} // private readonly usuarioService: UsuarioService,

  @UseGuards(LocalAuthGuard)
  @Post('/session/login')
  async login(@Req() req: RequestWithUser) {
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
