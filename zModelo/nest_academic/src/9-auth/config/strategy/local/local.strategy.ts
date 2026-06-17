import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Funcionario } from '../../../../3-funcionario/entity/funcionario.entity';
import { AuthService } from '../../../service/auth.service';

/**
 * ============================================================================
 * LocalStrategy - Estratégia de autenticação local (username + password)
 * ============================================================================
 *
 * Esta classe implementa uma estratégia Passport para autenticação local.
 * É acionada automaticamente quando @UseGuards(LocalAuthGuard) é usado.
 *
 * FLUXO:
 * 1. Requisição POST /auth/session/login chega com { login, password }
 * 2. @UseGuards(LocalAuthGuard) intercepta
 * 3. Passport extrai login e password do body
 * 4. LocalStrategy.validate(login, password) é chamado
 * 5. Se retornar um objeto, é colocado em req.user
 * 6. Se lançar exceção, retorna erro 401 (Unauthorized)
 *
 * ADAPTAÇÃO PARA HOTEL:
 * - Campos originais (Professor): email + password
 * - Campos Hotel: login + password (nome de login do funcionário)
 * - Retorna Funcionario (não Usuario)
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      // Nomes dos campos a serem extraídos do request body
      usernameField: 'login', // Busca 'login' no body (não 'username')
      passwordField: 'password', // Busca 'password' no body
    });
  }

  /**
   * validate(login, password)
   *
   * Método chamado automaticamente pelo Passport quando um
   * request com @UseGuards(LocalAuthGuard) é feito.
   *
   * RESPONSABILIDADES:
   * 1. Validar o login e senha (delega para AuthService)
   * 2. Retornar o funcionário se as credenciais forem válidas
   * 3. Lançar exceção se for inválido
   *
   * FLUXO:
   * 1. Chama authService.getAuthenticatedUser(login, password)
   * 2. Se retornar um Funcionario, Passport o coloca em req.user
   * 3. Se lançar exceção, Passport retorna 401
   *
   * RESULTADO:
   * - Se válido: req.user = { idUsuario, nomeLogin, senha, ativo, ... }
   * - Se inválido: erro 401 e nunca chega ao controller
   */
  async validate(login: string, password: string): Promise<Funcionario> {
    console.log('[LocalStrategy.validate] login recebido:', login);
    return await this.authService.getAuthenticatedUser(login, password);
  }
}
