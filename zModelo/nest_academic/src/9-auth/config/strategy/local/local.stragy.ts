import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Funcionario } from '../../../../3-funcionario/entity/funcionario.entity';
import { AuthService } from '../../../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(login: string, password: string): Promise<Funcionario> {
    return await this.authService.getAuthenticatedUser(login, password);
  }
}
