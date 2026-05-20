import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { LocalStrategy } from './config/strategy/local/local.stragy';
import { AuthController } from './controllers/auth.controllers';
import { AuthService } from './service/auth.service';
import { JsonWebTokenService } from './service/jwt.service';

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

  providers: [AuthService, LocalStrategy, JsonWebTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
