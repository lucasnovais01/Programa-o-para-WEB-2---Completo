import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import JwtAccessTokenGuard from './config/guard/jwt.access.guard';
import { JwtAccessTokenStrategy } from './config/strategy/jwt/jwt.access.strategy';
import { JwtRefreshTokenStrategy } from './config/strategy/jwt/jwt.refresh.strategy';
import { JwtVerificationTokenStrategy } from './config/strategy/jwt/jwt.verification.strategy';

import { LocalStrategy } from './config/strategy/local/local.strategy';
import { AuthController } from './controllers/auth.controllers';
import { AuthService } from './service/auth.service';
import { JsonWebTokenService } from './service/jwt.service';
import { PasswordController } from './controllers/password.controller';
import { EmailService } from '@/mail/service/email.service';

const provider = [
  AuthService,
  LocalStrategy,
  JsonWebTokenService,
  JwtAccessTokenStrategy,
  JwtRefreshTokenStrategy,
  JwtVerificationTokenStrategy,
  JwtAccessTokenGuard,
  EmailService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule,
    ConfigModule,
    UsuarioModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = Number(
          configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        );
        return {
          secret: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],

  providers: [...provider],
  exports: [JsonWebTokenService, JwtAccessTokenGuard],
  controllers: [AuthController, PasswordController],
})
export class AuthModule {}
