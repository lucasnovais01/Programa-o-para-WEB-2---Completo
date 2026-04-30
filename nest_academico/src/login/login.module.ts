import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginControllerCreate } from './controllers/usuario.controller.create';
import { LoginControllerFindAll } from './controllers/usuario.controller.findall';
import { LoginControllerFindOne } from './controllers/usuario.controller.findone';
import { LoginControllerRemove } from './controllers/usuario.controller.remove';
import { LoginControllerUpdate } from './controllers/usuario.controller.update';

import { Login } from './entity/login.entity';

import { LoginServiceCreate } from './service/usuario.service.create';
import { LoginServiceFindAll } from './service/usuario.service.findall';
import { LoginServiceFindOne } from './service/usuario.service.findone';
import { LoginServiceRemove } from './service/usuario.service.remove';
import { LoginServiceUpdate } from './service/usuario.service.update';

const usuarioControllers = [
  UsuarioControllerFindAll,
  UsuarioControllerFindOne,
  UsuarioControllerCreate,
  UsuarioControllerUpdate,
  UsuarioControllerRemove,
];

const usuarioServices = [
  UsuarioServiceCreate,
  UsuarioServiceUpdate,
  UsuarioServiceRemove,
  UsuarioServiceFindAll,
  UsuarioServiceFindOne,
];

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [...usuarioControllers],
  providers: [...usuarioServices],
  exports: [TypeOrmModule, ...usuarioServices],
})
export class UsuarioModule {}
