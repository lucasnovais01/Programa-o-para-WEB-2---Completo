import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from './entity/funcionario.entity';
import { Hospede } from 'src/1-hospede/entity/hospede.entity';
import { FuncionarioControllerCreate } from './controllers/funcionario.controller.create';
import { FuncionarioControllerFindAll } from './controllers/funcionario.controller.findall';
import { FuncionarioControllerFindOne } from './controllers/funcionario.controller.findone';
import { FuncionarioControllerUpdate } from './controllers/funcionario.controller.update';
import { FuncionarioControllerRemove } from './controllers/funcionario.controller.remove';
import { FuncionarioServiceCreate } from './service/funcionario.service.create';
import { FuncionarioServiceFindAll } from './service/funcionario.service.findall';
import { FuncionarioServiceFindOne } from './service/funcionario.service.findone';
import { FuncionarioServiceUpdate } from './service/funcionario.service.update';
import { FuncionarioServiceRemove } from './service/funcionario.service.remove';

const funcionarioControllers = [
  FuncionarioControllerCreate,
  FuncionarioControllerFindAll,
  FuncionarioControllerFindOne,
  FuncionarioControllerUpdate,
  FuncionarioControllerRemove,
];

const funcionarioServices = [
  FuncionarioServiceCreate,
  FuncionarioServiceFindAll,
  FuncionarioServiceFindOne,
  FuncionarioServiceUpdate,
  FuncionarioServiceRemove,
];

@Module({
  imports: [TypeOrmModule.forFeature([Funcionario, Hospede])],
  controllers: [...funcionarioControllers],
  providers: [...funcionarioServices],
})
export class FuncionarioModule {}
