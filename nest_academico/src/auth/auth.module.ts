import { Usuario } from '@/usuario/entity/usuario.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth.service';
import { AuthController } from './controllers/auth.controllers';
import { LocalStrategy } from './config/strategy/local/local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
