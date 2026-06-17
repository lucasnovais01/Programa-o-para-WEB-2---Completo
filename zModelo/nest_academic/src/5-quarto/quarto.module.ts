import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuartoControllerCreate } from './controllers/quarto.controller.create';
import { QuartoControllerFindAll } from './controllers/quarto.controller.findall';
import { QuartoControllerFindOne } from './controllers/quarto.controller.findone';
import { QuartoControllerRemove } from './controllers/quarto.controller.remove';
import { QuartoControllerUpdate } from './controllers/quarto.controller.update';
import { Quarto } from './entity/quarto.entity';
import { QuartoServiceCreate } from './service/quarto.service.create';
import { QuartoServiceFindAll } from './service/quarto.service.findall';
import { QuartoServiceFindOne } from './service/quarto.service.findone';
import { QuartoServiceRemove } from './service/quarto.service.remove';
import { QuartoServiceUpdate } from './service/quarto.service.update';

const quartoControllers = [
  QuartoControllerCreate,
  QuartoControllerFindAll,
  QuartoControllerFindOne,
  QuartoControllerUpdate,
  QuartoControllerRemove,
];

const quartoServices = [
  QuartoServiceCreate,
  QuartoServiceFindAll,
  QuartoServiceFindOne,
  QuartoServiceUpdate,
  QuartoServiceRemove,
];

@Module({
  imports: [TypeOrmModule.forFeature([Quarto])],
  controllers: [...quartoControllers],
  providers: [...quartoServices],
})
export class QuartoModule {}
