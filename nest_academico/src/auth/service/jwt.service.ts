import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { RequestUserPayload } from '../config/requestWithUser.interface';

export type TokenType = 'access' | 'refresh' | 'verification';

export interface EfetivaPermissao {
  resource: string;
  actions: string[];
}

export interface UserToken {
  idUsuario?: number;
  email?: string;
  nome?: string;
  role?: string[];
  permissions?: EfetivaPermissao[];
}

@Injectable()
export class JsonWebTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(userToken: RequestUserPayload, timer?: number) {
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

  async createRefreshtoken(usuario: UserToken) {
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

  private secretAccessToken() {
    return this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET');
  }

  private secretRefreshToken() {
    return this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET');
  }

  private secretVerificationToken() {
    return this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET');
  }

  private expireInSecondsAccessToken(timer?: number): number {
    return (
      timer ?? this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
    );
  }

  private expireInSecondsRefreshToken() {
    return this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  async verifyToken(
    token: string,
    type: TokenType = 'access',
  ): Promise<{ isValid: boolean; isExpired: boolean; payload: any | null }> {
    const secret = this.getSecretTokenType(type);
    try {
      const payload = await this.jwtService.verify(token, {
        secret,
      });
      return {
        isValid: true,
        isExpired: false,
        payload,
      };
    } catch (error: any) {
      const expiredPayload = this.jwtService.decode(token);
      const isExpired = error.name === 'TokenExpiredError';
      return {
        isValid: false,
        isExpired: isExpired,
        payload: expiredPayload || null,
      };
    }
  }

  private getSecretTokenType(type: TokenType): string {
    switch (type) {
      case 'refresh':
        return this.secretRefreshToken();
      case 'verification':
        return this.secretVerificationToken();
      case 'access':
      default:
        return this.secretAccessToken();
    }
  }
}
