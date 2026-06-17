import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

export interface UserToken {
  idUsuario?: number;
  email?: string | null;
}

@Injectable()
export class JsonWebTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(
    userToken: UserToken,
    timer?: number,
  ): Promise<{ accessToken: string; expireInAccessToken: number }> {
    const { idUsuario } = userToken;
    const data: JwtPayload = {
      idUsuario,
    };

    const expireInAccessToken = this.expireInSecondsAccessToken(timer);
    const secretAccessToken = this.secretAccessToken();
    const accessToken = await this.jwtService.signAsync(data, {
      secret: secretAccessToken,
      expiresIn: `${expireInAccessToken}s`,
    });
    return { accessToken, expireInAccessToken };
  }

  async createRefreshtoken(
    usuario: UserToken,
  ): Promise<{ refreshToken: string; expireInRefreshToken: number }> {
    const { idUsuario } = usuario;
    const data: JwtPayload = {
      idUsuario,
    };

    const expireInRefreshToken = this.expireInSecondsRefreshToken();
    const secretRefreshToken = this.secretRefreshToken();
    const refreshToken = await this.jwtService.signAsync(data, {
      secret: secretRefreshToken,
      expiresIn: `${expireInRefreshToken}s`,
    });
    return { refreshToken, expireInRefreshToken };
  }

  async createPasswordResetToken(
    usuario: UserToken,
  ): Promise<{ resetToken: string; expireInPasswordResetToken: number }> {
    const { idUsuario, email } = usuario;
    const data: JwtPayload = {
      idUsuario,
      email,
    };

    const expireInPasswordResetToken = this.expireInSecondsPasswordResetToken();
    const secretPasswordResetToken = this.secretPasswordResetToken();
    const resetToken = await this.jwtService.signAsync(data, {
      secret: secretPasswordResetToken,
      expiresIn: `${expireInPasswordResetToken}s`,
    });

    return { resetToken, expireInPasswordResetToken };
  }

  private secretAccessToken(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET');
  }

  private secretRefreshToken(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  private expireInSecondsAccessToken(timer?: number): number {
    return (
      timer ??
      Number(
        this.configService.getOrThrow<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        ),
      )
    );
  }

  private expireInSecondsRefreshToken(): number {
    return Number(
      this.configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
    );
  }

  private secretPasswordResetToken(): string {
    return this.configService.getOrThrow<string>(
      'JWT_PASSWORD_RESET_TOKEN_SECRET',
    );
  }

  private expireInSecondsPasswordResetToken(): number {
    return Number(
      this.configService.getOrThrow<string>(
        'JWT_PASSWORD_RESET_TOKEN_EXPIRATION_TIME',
      ),
    );
  }

  async verifyRefreshToken(token: string): Promise<UserToken> {
    return await this.jwtService.verifyAsync<UserToken>(token, {
      secret: this.secretRefreshToken(),
    });
  }

  async verifyPasswordResetToken(token: string): Promise<UserToken> {
    return await this.jwtService.verifyAsync<UserToken>(token, {
      secret: this.secretPasswordResetToken(),
    });
  }

  verifyToken(token: string): UserToken {
    return this.jwtService.verify<UserToken>(token, {
      secret: this.configService.getOrThrow<string>(
        'JWT_VERIFICATION_TOKEN_SECRET',
      ),
    });
  }
}
