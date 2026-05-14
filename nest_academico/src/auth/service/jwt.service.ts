import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from 'jsonwebtoken';

export interface UserToken {
  idUsuario?: number;
  email?: string;
}

@Injectable()
export class JsonWebTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(userToken: UserToken, timer?: number) {
    const { idUsuario } = userToken; // vou usar userToken em vez de usuario, para deixar mais didático
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

  async createRefreshToken(usuario: UserToken) {
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

  private expireInSecondsAccessToken(timer?: number): number {
    return (
      timer ??
      this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_TIMER')
    );
  }

  private expireInSecondsRefreshToken() {
    return this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  async verifyToken(token: string) {
    return await this.jwtService.verify(token, {
      secret: this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET'),
    });
  }
}
