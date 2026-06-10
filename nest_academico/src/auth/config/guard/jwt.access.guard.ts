import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { ApiException } from '../../../commons/exceptions/error/api.exceptions';
import { UsuarioService } from '../../../usuario/service/usuario.service';
import { JsonWebTokenService } from '../../service/jwt.service';

@Injectable()
export default class JwtAccessTokenGuard extends PassportAuthGuard(
  'jwt-access',
) {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JsonWebTokenService,
  ) {
    super({
      passReqToCallbak: true,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookieAccessToken = this.extractToken(request);

    if (!cookieAccessToken) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'Não existe sessão para o usuário',
      );
    }

    const { isValid, isExpired, payload } =
      await this.jwtService.verifyToken(cookieAccessToken);

    if (!isValid || !payload) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'Token de acesso não é válido',
      );
    }

    if (isExpired) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'Token de acesso expirado!',
      );
    }

    const usuarioLogado = await this.usuarioService.buscarPorId(
      payload.idUsuario,
    );

    request.user = {
      idUsuario: usuarioLogado.idUsuario,
      email: usuarioLogado.email,
      name: usuarioLogado.nomeUsuario,
      role: '',
      permissions: '',
      isVerified: usuarioLogado.email ? true : false,
    };

    return true;
  }

  private extractToken(request: any) {
    const cookieName = process.env.SESSION_COOKIE_NAME || 'Authentication';
    const sessionToken = request.cookies?.[cookieName];
    return sessionToken;
  }
}
