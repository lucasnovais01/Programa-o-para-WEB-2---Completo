import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// MUDANÇA 1: importamos Usuario no lugar de Auth
// Motivo: o AuthService injeta Repository<Usuario>, então o módulo
// precisa registrar a entidade Usuario para o TypeORM disponibilizar
// esse repositório via injeção de dependência.

import { Usuario } from '../usuario/entity/usuario.entity';

// Auth entity deletada, não registramos mais aqui
// import { Auth } from './entity/auth.entity'; // removido essa linha

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './service/auth.service';

const authControllers = [AuthController];
const authServices = [AuthService];

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]), // MUDANÇA: Usuario no lugar de Auth
  ],
  controllers: [...authControllers],
  providers: [...authServices],
  exports: [TypeOrmModule, ...authServices],
})
export class AuthModule {}
