import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Usuario } from '../../../../usuario/entities/usuario.entity';
import { AuthService } from '../../../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'emailUsuario',
      passwordField: 'senhaUsuario',
    });
  }
  // No meu sistema ao contrário do sistema professor, o nome é emailUsuario e senhaUsuario ao contrario de username e password do sistema do meu professor
  // então eu preciso passar isso para o passport local strategy, caso contrário ele vai procurar por username e password
  // e não vai encontrar, por isso eu passo essas opções no super() do constructor.
  async validate(
    emailUsuario: string,
    senhaUsuario: string,
  ): Promise<Usuario | null> {
    console.log('[DEBUG][LocalStrategy] validate start', {
      emailUsuario,
      senhaProvided:
        typeof senhaUsuario === 'string' && senhaUsuario.length > 0,
    });
    const usuario = await this.authService.getAuthenticatedUser(
      emailUsuario,
      senhaUsuario,
    );
    console.log('[DEBUG][LocalStrategy] validate success', {
      idUsuario: usuario?.idUsuario,
      emailUsuario: usuario?.emailUsuario,
    });
    return usuario;
  }
}
