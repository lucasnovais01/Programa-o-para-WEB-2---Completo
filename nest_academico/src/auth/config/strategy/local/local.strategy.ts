import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Usuario } from '../../../../usuario/entities/usuario.entity';
import { AuthService } from '../../../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'senha',
    });
  }

  async validate(email: string, senha: string): Promise<Usuario | null> {
    const usuario = await this.authService.getAuthenticatedUser(email, senha);
    return usuario;
  }
}
