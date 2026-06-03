import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nest/passport';
import { UsuarioService } from '@/usuario/service/usuario.service';
import { JsonWebTokenService } from '@/auth/service/jwt.service';

@Injectable()
export default class JwtAccessTokenGuard extends PassportAuthGuard(
  'jwt-access',
) {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JsonWebTokenService,
  ) {
    super({
      passReToCallback: true,
    });
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const cookieAccessToken = this.extractToken(request);
  }
  private extractToken(request: any) {
    const cookieName = process.env.SESSION_COOKIE_NAME || 'Authentication';
    const sessionToken = request.cookies?.[cookieName];

    return sessionToken;
  }
}
