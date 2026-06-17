import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/10-mail/service/email.service';
import { Repository } from 'typeorm';
import { Funcionario } from '../../3-funcionario/entity/funcionario.entity';
import { JsonWebTokenService, UserToken } from './jwt.service';

/**
 * ============================================================================
 * AuthService - Lógica de autenticação e geração de tokens
 * ============================================================================
 *
 * Responsável por:
 * 1. Validar credenciais (nomeLogin + senha)
 * 2. Gerar access token (curta duração, para requisições)
 * 3. Gerar refresh token (longa duração, para renovação de access token)
 *
 * ADAPTAÇÃO PARA HOTEL (vs. modelo original com Usuario):
 * - Usa entidade real do projeto: Funcionario
 * - Campo de login: nomeLogin (não email)
 * - Valida campo ativo (só funcionários ativos podem fazer login)
 * - Suporta bcrypt ou senha em texto plano (para desenvolvimento)
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: Repository<Funcionario>,
    private readonly jsonWebTokenService: JsonWebTokenService,
    private readonly emailService: EmailService,
  ) {}

  /*
  // Gera um JWT access token para o funcionário autenticado.
  // O token inclui apenas o idUsuario para segurança.

  async getJwtAccessToken(funcionario: Funcionario) {
    const { accessToken, expireInAccessToken } =
      await this.jsonWebTokenService.createAccessToken(funcionario);

    return {
      accessToken,
      expireInAccessToken,
    };
  }
*/

  /**
   * Gera um cookie HTTP-only com o refresh token.
   *
   * Propriedades:
   * - HttpOnly: JavaScript no browser não consegue acessar (segurança contra XSS)
   * - SameSite=Strict: Impede CSRF (não envia cookie em requisições cross-site)
   * - Max-Age: Tempo de expiração em segundos
   * - Path=/: Válido em toda a aplicação
   */
  private getCookieRefreshToken(
    token: string,
    expiresInSeconds: number,
  ): string {
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresInSeconds}; SameSite=Strict`;
  }

  /**
   * getJwtAccessToken(funcionario)
   *
   * Gera um JWT access token com curta duração (~15-60 minutos).
   * Usado para autenticar requisições subsequentes.
   *
   * FLUXO:
   * 1. Recebe um funcionário autenticado
   * 2. Extrai apenas idUsuario (para segurança, não incluir dados sensíveis)
   * 3. Cria um JWT assinado com JWT_ACCESS_TOKEN_SECRET
   * 4. Define expiração em JWT_ACCESS_TOKEN_EXPIRATION_TIME
   * 5. Retorna o token e tempo de expiração
   */
  async getJwtAccessToken(funcionario: Funcionario) {
    const { accessToken, expireInAccessToken } =
      await this.jsonWebTokenService.createAccessToken(funcionario);

    return {
      accessToken,
      expireInAccessToken,
    };
  }

  /**
   * getJwtRefreshToken(funcionario)
   *
   * Gera um JWT refresh token com longa duração (~7 dias).
   * Usado para renovar o access token quando ele expirar.
   *
   * FLUXO:
   * 1. Extrai idUsuario do funcionário
   * 2. Cria um refresh token com expiração longa
   * 3. Encapsula em um cookie HTTP-only (seguro, não acessível por JS)
   * 4. Retorna o token, o cookie e o tempo de expiração
   *
   * IMPORTANTE:
   * Refresh tokens devem ser armazenados em HTTP-only cookies
   * para proteger contra XSS (Cross-Site Scripting)
   */
  async getJwtRefreshToken(funcionario: Funcionario) {
    const userToken: UserToken = {
      idUsuario: funcionario.idUsuario,
    };

    const { refreshToken, expireInRefreshToken } =
      await this.jsonWebTokenService.createRefreshtoken(userToken);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.funcionarioRepository.update(
      { idUsuario: funcionario.idUsuario },
      { refreshToken: hashedRefreshToken },
    );

    return {
      refreshToken,
      cookie: this.getCookieRefreshToken(refreshToken, expireInRefreshToken),
      expireInRefreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        'Refresh token não informado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload: UserToken =
      await this.jsonWebTokenService.verifyRefreshToken(refreshToken);

    if (!payload || !payload.idUsuario) {
      throw new HttpException(
        'Refresh token inválido',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const funcionario = await this.funcionarioRepository.findOneBy({
      idUsuario: payload.idUsuario,
    });

    if (!funcionario || !funcionario.refreshToken) {
      throw new HttpException(
        'Refresh token inválido',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      funcionario.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new HttpException(
        'Refresh token inválido',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { accessToken, expireInAccessToken } =
      await this.getJwtAccessToken(funcionario);
    const { refreshToken: newRefreshToken, cookie } =
      await this.getJwtRefreshToken(funcionario);

    return {
      accessToken,
      expireInAccessToken,
      refreshToken: newRefreshToken,
      cookie,
    };
  }

  async sendPasswordReset(email: string) {
    const funcionario = await this.funcionarioRepository
      .createQueryBuilder('funcionario')
      .where('LOWER(funcionario.EMAIL) = LOWER(:email)', { email })
      .getOne();

    if (!funcionario || funcionario.ativo !== 1 || !funcionario.email) {
      return;
    }

    const { resetToken } =
      await this.jsonWebTokenService.createPasswordResetToken({
        idUsuario: funcionario.idUsuario,
        email: funcionario.email,
      });

    await this.emailService.sendPasswordResetEmail(
      funcionario.email,
      funcionario.nomeLogin,
      resetToken,
    );
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload: UserToken =
        await this.jsonWebTokenService.verifyPasswordResetToken(token);

      if (!payload || !payload.idUsuario) {
        throw new HttpException(
          'Token de reset inválido',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const funcionario = await this.funcionarioRepository.findOneBy({
        idUsuario: payload.idUsuario,
      });

      if (!funcionario) {
        throw new HttpException(
          'Funcionário não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      funcionario.senha = await bcrypt.hash(newPassword, 10);
      funcionario.refreshToken = null;

      await this.funcionarioRepository.save(funcionario);
    } catch {
      throw new HttpException(
        'Token de reset inválido ou expirado',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async clearRefreshTokenFromCookie(refreshToken: string) {
    const payload: UserToken =
      await this.jsonWebTokenService.verifyRefreshToken(refreshToken);

    if (!payload || !payload.idUsuario) {
      return;
    }

    await this.funcionarioRepository.update(
      { idUsuario: payload.idUsuario },
      { refreshToken: null },
    );
  }

  getLogoutCookie(): string {
    return 'Refresh=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
  }

  /**
   * getAuthenticatedUser(nomeLogin, senha)
   *
   * Valida credenciais e retorna o funcionário se válido.
   *
   * FLUXO:
   * 1. Busca funcionário no banco por nomeLogin
   * 2. Verifica se está ATIVO (não pode fazer login se inativo)
   * 3. Compara senha usando bcrypt (com fallback para texto plano)
   * 4. Retorna funcionário se tudo for válido
   * 5. Lança exceção se algo falhar
   *
   * CHAMADO POR:
   * - LocalStrategy.validate() do Passport
   * - Está aqui para centralizar a lógica de autenticação
   */
  async getAuthenticatedUser(
    nomeLogin: string,
    senha: string,
  ): Promise<Funcionario> {
    const funcionario = await this.findByLogin(nomeLogin);
    if (!funcionario) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }

    if (funcionario.ativo !== 1) {
      throw new HttpException('Usuário inativo', HttpStatus.FORBIDDEN);
    }

    // Debug: checar se o cadastro do usuário contém senha hash ou texto plano
    const storedSenha = funcionario.senha;
    const storedSenhaLength = storedSenha?.length ?? 0;
    const storedSenhaIsBcrypt = storedSenha?.startsWith('$2');
    console.log(
      `Login attempt for ${nomeLogin}: stored senha length=${storedSenhaLength}, startsWith $2?=${storedSenhaIsBcrypt}`,
    );

    await this.verificarSenha(senha, funcionario.senha);
    return funcionario;
  }

  /**
   * findByLogin(nomeLogin)
   *
   * Busca um funcionário pelo nomeLogin (campo de login único).
   *
   * ADAPTAÇÃO PARA HOTEL:
   * - Campo original (Professor): email
   * - Campo Hotel: NOME_LOGIN
   * - TypeORM mapeia automaticamente para a coluna correta
   *
   * OBSERVAÇÃO:
   * Se quiser mudar para buscar por email futuramente,
   * basta adicionar um campo email à tabela COCAO_FUNCIONARIO
   * e alterar esta query.
   */
  async findByLogin(nomeLogin: string): Promise<Funcionario | null> {
    console.log(
      '[AuthService.findByLogin] procurando funcionário por login/email:',
      nomeLogin,
    );

    const funcionario = await this.funcionarioRepository
      .createQueryBuilder('funcionario')
      .where(
        '(LOWER(funcionario.NOME_LOGIN) = LOWER(:login) OR LOWER(funcionario.EMAIL) = LOWER(:login))',
        { login: nomeLogin },
      )
      .getOne();

    if (!funcionario) {
      console.log(
        '[AuthService.findByLogin] nenhum funcionário encontrado para:',
        nomeLogin,
      );
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }

    console.log('[AuthService.findByLogin] funcionário encontrado:', {
      idUsuario: funcionario.idUsuario,
      nomeLogin: funcionario.nomeLogin,
      email: funcionario.email,
      ativo: funcionario.ativo,
    });

    return funcionario;
  }

  /**
   * verificarSenha(senha, hashedSenha)
   *
   * Valida se a senha informada é igual à armazenada.
   *
   * SEGURANÇA:
   * 1. Tenta com bcrypt primeiro (recomendado para produção)
   * 2. Se não for bcrypt, tenta comparação direta (para desenvolvimento)
   *
   * IMPORTANTE:
   * Em produção, as senhas DEVEM ser criptografadas com bcrypt.
   * Texto plano nunca deve ser armazenado no banco.
   *
   * TODO: Implementar rota de "alterar senha" para criptografar senhas
   * antigas e novos registros sempre com bcrypt.
   */
  async verificarSenha(senha: string, hashedSenha: string): Promise<boolean> {
    const isSenhaMatching = await bcrypt.compare(senha, hashedSenha);
    if (isSenhaMatching) {
      return true;
    }

    // Fallback para texto plano (desenvolvimento)
    if (senha === hashedSenha) {
      return true;
    }

    // Se o fluxo chega aqui, o usuário foi encontrado e está ativo,
    // mas a senha enviada pelo frontend não confere com o valor armazenado.
    // Esse erro é retornado como 400 Bad Request no backend.
    throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
  }
}
