import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioControllerCreate } from './controllers/usuario.controller.create';
import { UsuarioControllerFindAll } from './controllers/usuario.controller.findall';
import { UsuarioControllerFindOne } from './controllers/usuario.controller.findone';
import { UsuarioControllerRemove } from './controllers/usuario.controller.remove';
import { UsuarioControllerUpdate } from './controllers/usuario.controller.update';

import { Usuario } from './entity/usuario.entity';

import { UsuarioServiceCreate } from './service/usuario.service.create';
import { UsuarioServiceFindAll } from './service/usuario.service.findall';
import { UsuarioServiceFindOne } from './service/usuario.service.findone';
import { UsuarioServiceRemove } from './service/usuario.service.remove';
import { UsuarioServiceUpdate } from './service/usuario.service.update';

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
