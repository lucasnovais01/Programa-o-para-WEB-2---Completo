import { Usuario } from '@/usuario/entity/usuario.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth.service';
import { AuthController } from './controllers/auth.controllers';
import { LocalStrategy } from './config/strategy/local/local.strategy';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario])],
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACESS_TOKEN_EXPIRATION'),
        }
      }),
    }),
  
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
