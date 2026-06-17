import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LocalAuthGuard } from '../config/guard/local.auth.guard';
import type RequestWithUser from '../config/requestWithUser.interface';
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../dto/request/auth.request';
import { AuthService } from '../service/auth.service';

/**
 * ============================================================================
 * AuthController - Endpoint de autenticação
 * ============================================================================
 *
 * Responsável por expor o endpoint de login.
 * Usa Passport para validar credenciais locais (nomeLogin + password).
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/session/login
   *
   * Realiza login de um funcionário usando nomeLogin e password.
   *
   * FLUXO:
   * 1. Requisição chega com { login, password } no body
   * 2. @UseGuards(LocalAuthGuard) dispara LocalStrategy.validate()
   * 3. LocalStrategy busca o funcionário no banco e valida a senha
   * 4. Se válido, Passport coloca o funcionário em req.user
   * 5. AuthController.login() retorna os tokens
   *
   * ADAPTAÇÃO PARA HOTEL:
   * - Campo original: usuário + email
   * - Campo hotel: funcionario com nomeLogin + senha
   * - TypeORM valida automaticamente contra COCAO_FUNCIONARIO
   *
   * RESPOSTA:
   * {
   *   "accessToken": "eyJhbGc...",
   *   "expireInAccessToken": 3600,
   *   "refreshToken": "eyJhbGc..."
   * }
   */
  @UseGuards(LocalAuthGuard)
  @Post('/session/login')
  // Este método precisa ser corrigido para alinhar o backend com o frontend
  // que agora faz login diretamente em /auth/session/login. Ou seja, é este
  // controller que expõe o endpoint raiz que o React consome sem o prefixo
  // `/rest/sistema/v1`.
  async login(@Req() req: RequestWithUser) {
    // Gera access token a partir do funcionário autenticado
    const { accessToken, expireInAccessToken } =
      await this.authService.getJwtAccessToken(req.user);

    // Gera refresh token e cookie HTTP-only
    const { refreshToken, cookie } = await this.authService.getJwtRefreshToken(
      req.user,
    );

    // Define o cookie HTTP-only no header de resposta
    // (navegador armazena automaticamente para requisições futuras)
    req.res?.setHeader('Set-Cookie', cookie);

    // Retorna os tokens e os dados mínimos do usuário para o frontend
    return {
      accessToken,
      expireInAccessToken,
      refreshToken,
      usuario: {
        idUsuario: req.user.idUsuario,
        nomeLogin: req.user.nomeLogin,
        emailUsuario: req.user.email ?? null,
      },
    };
  }

  @Post('/session/refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieHeader = req.headers?.cookie;
    const refreshTokenFromCookie = this.extractRefreshToken(cookieHeader);
    const token = refreshToken || refreshTokenFromCookie;
    if (!token) {
      throw new HttpException(
        'Refresh token não informado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const {
      accessToken,
      expireInAccessToken,
      refreshToken: newRefreshToken,
      cookie,
    } = await this.authService.refreshToken(token);

    res.setHeader('Set-Cookie', cookie);

    return {
      accessToken,
      expireInAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  @Post('/session/forgot')
  async forgot(@Body() body: ForgotPasswordRequest) {
    await this.authService.sendPasswordReset(body.email);
    return {
      message:
        'Se o email estiver cadastrado, você receberá um link de redefinição.',
    };
  }

  @Post('/session/reset')
  async reset(@Body() body: ResetPasswordRequest) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return {
      message: 'Senha redefinida com sucesso. Faça login com a nova senha.',
    };
  }

  @Post('/session/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookieHeader = req.headers?.cookie;
    const refreshToken = this.extractRefreshToken(cookieHeader);

    if (refreshToken) {
      await this.authService.clearRefreshTokenFromCookie(refreshToken);
    }

    res.setHeader('Set-Cookie', this.authService.getLogoutCookie());
    return {
      message: 'Logout realizado com sucesso',
    };
  }

  private extractRefreshToken(cookieHeader?: string): string | null {
    if (!cookieHeader) {
      return null;
    }

    const refreshCookie = cookieHeader
      .split(';')
      .map((pair) => pair.trim())
      .find((pair) => pair.startsWith('Refresh='));

    if (!refreshCookie) {
      return null;
    }

    return refreshCookie.split('=')[1] ?? null;
  }
}
