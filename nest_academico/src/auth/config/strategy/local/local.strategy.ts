import { AuthService } from '@/auth/service/auth.service';
import { Usuario } from '@/usuario/entity/usuario.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
// O extends serve para
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, senha: string): Promise<Usuario> {
    const usuario = await this.authService.getAuthenticatedUser(email, senha);
    return usuario;
  }
}
