import { Module } from '@nestjs/common';
import { CidadeControllerFindAll } from './controllers/cidade.controller.findall';
import { CidadeControllerFindOne } from './controllers/cidade.controller.findone';
import { CidadeControllerCreate } from './controllers/cidade.controller.create';
import { CidadeControllerUpdate } from './controllers/cidade.controller.update';
import { CidadeControllerRemove } from './controllers/cidade.controller.remove';
import { CidadeServiceCreate } from './service/cidade.service.create';
import { CidadeServiceUpdate } from './service/cidade.service.update';
import { CidadeServiceRemove } from './service/cidade.service.remove';
import { CidadeServiceFindAll } from './service/cidade.service.findall';

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
];

@Module({
  imports: [],
  controllers: [
    ...cidadeControllers, //Este é um floreio pra deixar o código mais bonito, pega o array acima
  ],
  providers: [...cidadeServices],
  exports: [...cidadeServices],
})
export class CidadeModule {}
