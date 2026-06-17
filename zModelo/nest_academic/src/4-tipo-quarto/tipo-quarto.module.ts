import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoQuartoControllerCreate } from './controllers/tipo-quarto.controller.create';
import { TipoQuartoControllerFindAll } from './controllers/tipo-quarto.controller.findall';
import { TipoQuartoControllerFindOne } from './controllers/tipo-quarto.controller.findone';
import { TipoQuartoControllerRemove } from './controllers/tipo-quarto.controller.remove';
import { TipoQuartoControllerUpdate } from './controllers/tipo-quarto.controller.update';
import { TipoQuarto } from './entity/tipo-quarto.entity';
import { TipoQuartoServiceCreate } from './service/tipo-quarto.service.create';
import { TipoQuartoServiceFindAll } from './service/tipo-quarto.service.findall';
import { TipoQuartoServiceFindOne } from './service/tipo-quarto.service.findone';
import { TipoQuartoServiceRemove } from './service/tipo-quarto.service.remove';
import { TipoQuartoServiceUpdate } from './service/tipo-quarto.service.update';

const tipoQuartoControllers = [
  TipoQuartoControllerCreate,
  TipoQuartoControllerFindAll,
  TipoQuartoControllerFindOne,
  TipoQuartoControllerUpdate,
  TipoQuartoControllerRemove,
];

const tipoQuartoServices = [
  TipoQuartoServiceCreate,
  TipoQuartoServiceFindAll,
  TipoQuartoServiceFindOne,
  TipoQuartoServiceUpdate,
  TipoQuartoServiceRemove,
];

@Module({
  imports: [TypeOrmModule.forFeature([TipoQuarto])],
  controllers: [...tipoQuartoControllers],
  providers: [...tipoQuartoServices],
})
export class TipoQuartoModule {}
