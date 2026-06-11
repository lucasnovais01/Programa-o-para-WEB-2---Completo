import { AuthService } from '@/auth/service/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  // talvz precise de uma notificação perguntando se o usuário consente na coleta de dados

  validate(
    req: Request, // req serve para pegar o ip do cliente, o request do nest, nome da máquina, OS da máquina, etc..
    accessToken: string,
    refreshToken: string,
    profile: any, // é jogado dentro da uma tabela, geralmente é chamado de socialLogin por exemplo, e sempre é cardinalidade 1.. para ..1 com o usuario
  ) {}
}
