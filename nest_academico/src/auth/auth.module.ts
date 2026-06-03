import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { LocalStrategy } from './config/strategy/local/local.stragy';
import { AuthController } from './controllers/auth.controllers';
import { AuthService } from './service/auth.service';
import { JsonWebTokenService } from './service/jwt.service';
import { JwtVerificationTokenStrategy } from './config/strategy/jwt/jwt.verification.strategy';
import { JwtRefreshTokenStrategy } from './config/strategy/jwt/jwt.refresh.strategy';
import { JwtAccessTokenStrategy } from './config/strategy/jwt/jwt.access.strategy';

const providers = [
  AuthService,
  LocalStrategy,
  JsonWebTokenService,
  JwtAccessTokenStrategy,
  JwtRefreshTokenStrategy,
  JwtVerificationTokenStrategy,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
  ],

  providers: [...providers],
  controllers: [AuthController],
})
export class AuthModule {}
