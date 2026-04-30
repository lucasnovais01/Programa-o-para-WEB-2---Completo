import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth } from './entity/auth.entity';

import { AuthController } from './controllers/auth.controller';

import { AuthService } from './service/auth.service';

const authControllers = [AuthController];

const authServices = [AuthService];

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [...authControllers],
  providers: [...authServices],
  exports: [TypeOrmModule, ...authServices],
})
export class AuthModule {}
