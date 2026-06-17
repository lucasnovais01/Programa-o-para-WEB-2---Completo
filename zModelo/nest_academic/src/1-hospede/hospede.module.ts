import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospede } from './entity/hospede.entity';
// Importação dos Controllers:
import { HospedeControllerFindAll } from './controllers/hospede.controller.findall';
import { HospedeControllerFindOne } from './controllers/hospede.controller.findone';
import { HospedeControllerCreate } from './controllers/hospede.controller.create';
import { HospedeControllerUpdate } from './controllers/hospede.controller.update';
import { HospedeControllerRemove } from './controllers/hospede.controller.remove';
// Importação dos Services:
import { HospedeServiceCreate } from './service/hospede.service.create';
import { HospedeServiceUpdate } from './service/hospede.service.update';
import { HospedeServiceRemove } from './service/hospede.service.remove';
import { HospedeServiceFindAll } from './service/hospede.service.findall';
import { HospedeServiceFindOne } from './service/hospede.service.findone';

const hospedeControllers = [
  // Constante para agrupar os controllers
  HospedeControllerFindAll,
  HospedeControllerFindOne,
  HospedeControllerCreate,
  HospedeControllerUpdate,
  HospedeControllerRemove,
];

const hospedeServices = [
  //Constante para agrupar os services
  HospedeServiceCreate,
  HospedeServiceUpdate,
  HospedeServiceRemove,
  HospedeServiceFindAll,
  HospedeServiceFindOne,
];

@Module({
  imports: [
    // 1. Registra a entidade Hospede no TypeORM  // Isso permite que @InjectRepository(Hospede) funcione nos services.
    TypeOrmModule.forFeature([Hospede]),
  ],
  controllers: [
    // 2. Registra todos os controllers do array
    ...hospedeControllers, // Floreio, usa o spread operator (...)
  ],
  providers: [
    // 3. Registra todos os services como provedores de injeção de dependência
    ...hospedeServices,
  ],
  exports: [
    // 4. Exporta os services (e o TypeOrmModule) para que outros módulos possam usá-los (se necessário)
    TypeOrmModule, // Exporta o acesso ao repositório de Hospede
    ...hospedeServices,
  ],
})
export class HospedeModule {}

/*
 * ==============================================================
 * TUTORIAL: hospede.module.ts
 * ==============================================================
 * * O que é?
 * - O Módulo é o "contêiner" do NestJS para o recurso Hóspede.
 * - Ele agrupa e organiza todos os arquivos relacionados (Controllers, Services, Entidades).
 * * Para que serve?
 * 1. `imports`: Traz dependências externas (como o `TypeOrmModule` para a entidade `Hospede`).
 * 2. `controllers`: Declara quais classes são responsáveis por lidar com as rotas HTTP (API).
 * 3. `providers`: Declara quais classes devem ser injetáveis (como os `Services` que contêm a lógica de negócios).
 * 4. `exports`: (Opcional) Torna os `providers` (ou o `TypeOrmModule`) disponíveis para outros módulos que importem o `HospedeModule`.
 * * Padrão do Professor:
 * - O uso de arrays `hospedeControllers` e `hospedeServices` com o spread operator (`...`) é um
 * estilo de organização para manter a declaração `@Module` limpa,
 * especialmente em módulos grandes.
 * * ==============================================================
 */
