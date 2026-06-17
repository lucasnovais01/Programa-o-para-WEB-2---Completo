import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioControllerCreate } from './controllers/usuario.controller.create';
import { UsuarioControllerFindAll } from './controllers/usuario.controller.findall';
import { UsuarioControllerFindOne } from './controllers/usuario.controller.findone';
import { UsuarioControllerRemove } from './controllers/usuario.controller.remove';
import { UsuarioControllerUpdate } from './controllers/usuario.controller.update';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './service/usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuarioService],
  exports: [UsuarioService],
  controllers: [
    UsuarioControllerFindAll,
    UsuarioControllerCreate,
    UsuarioControllerFindOne,
    UsuarioControllerUpdate,
    UsuarioControllerRemove,
  ],
})
export class UsuarioModule {}
