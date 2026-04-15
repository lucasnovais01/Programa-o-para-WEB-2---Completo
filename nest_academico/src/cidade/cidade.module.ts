import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CidadeControllerCreate } from './controllers/cidade.controller.create';
import { CidadeControllerFindAll } from './controllers/cidade.controller.findall';
import { CidadeControllerFindOne } from './controllers/cidade.controller.findone';
import { CidadeControllerRemove } from './controllers/cidade.controller.remove';
import { CidadeControllerUpdate } from './controllers/cidade.controller.update';
import { Cidade } from './entity/cidade.entity';
import { CidadeServiceCreate } from './service/cidade.service.create';
import { CidadeServiceFindAll } from './service/cidade.service.findall';
import { CidadeServiceFindOne } from './service/cidade.service.findone';
import { CidadeServiceRemove } from './service/cidade.service.remove';
import { CidadeServiceUpdate } from './service/cidade.service.update';

const cidadeControllers = [
  CidadeControllerFindAll,
  CidadeControllerFindOne,
  CidadeControllerCreate,
  CidadeControllerUpdate,
  CidadeControllerRemove,
];

const cidadeServices = [
  CidadeServiceCreate,
  CidadeServiceUpdate,
  CidadeServiceRemove,
  CidadeServiceFindAll,
  CidadeServiceFindOne,
];

@Module({
  imports: [TypeOrmModule.forFeature([Cidade])],
  controllers: [...cidadeControllers],
  providers: [...cidadeServices],
  exports: [TypeOrmModule, ...cidadeServices],
})
export class CidadeModule {}
