import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcao } from './entity/funcao.entity';

import { FuncaoControllerCreate } from './controllers/funcao.controller.create';
import { FuncaoControllerFindAll } from './controllers/funcao.controller.findall';
import { FuncaoControllerFindOne } from './controllers/funcao.controller.findone';
import { FuncaoControllerUpdate } from './controllers/funcao.controller.update';
import { FuncaoControllerRemove } from './controllers/funcao.controller.remove';

import { FuncaoServiceCreate } from './service/funcao.service.create';
import { FuncaoServiceUpdate } from './service/funcao.service.update';
import { FuncaoServiceRemove } from './service/funcao.service.remove';
import { FuncaoServiceFindAll } from './service/funcao.service.findall';
import { FuncaoServiceFindOne } from './service/funcao.service.findone';

const funcaoControllers = [
  FuncaoControllerCreate,
  FuncaoControllerFindAll,
  FuncaoControllerFindOne,
  FuncaoControllerUpdate,
  FuncaoControllerRemove,
];

const funcaoServices = [
  FuncaoServiceCreate,
  FuncaoServiceUpdate,
  FuncaoServiceRemove,
  FuncaoServiceFindAll,
  FuncaoServiceFindOne,
];

@Module({
  imports: [TypeOrmModule.forFeature([Funcao])],
  controllers: [...funcaoControllers],
  providers: [...funcaoServices],
  exports: [TypeOrmModule, ...funcaoServices],
})
export class FuncaoModule {}
