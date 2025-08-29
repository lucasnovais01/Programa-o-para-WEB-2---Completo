/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { CidadeModule } from 'src/cidade/cidade.module';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';

@Module({
  imports: [CidadeModule],
//  controllers: [], // Controllers handle incoming requests, é como se fosse o ponto de entrada da aplicação
//  providers: [], //Providers are used to encapsulate business logic and can be injected into controllers or other providers,
//  //é como se fosse o serviço que contém a lógica de negócio
//  exports: [], //Exporting AppService allows it to be used in other modules

})
export class AppModule {}
