import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { CidadeModule } from 'src/cidade/cidade.module';
//import { Cidade } from 'src/cidade/entity/cidade.entity';

import oracledb from 'oracledb';

// oracledb.initOracleClient({ libDir: 'C:/oracle/instantclient_23_10' });

// Importa e executa a configuração do Oracle Client
//const oracledb = require('oracledb');
//import "../oracle-client.config";

/*
Correto na escola
*/
oracledb.initOracleClient({
  libDir: 'E:/.Lucas Novais/oracle/client',
});

// IMPORTANTE: OS DADOS DE @Module SÃO SENSÍVEIS !!!
// E NÃO DEVEM SER FEITO UPLOAD DELES NO GITHUB

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_AUTOLOADENTITIES: Joi.boolean().default(true),
        DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
        DATABASE_LOGGING: Joi.boolean().default(true),

        DATABASE_ROW_NUMBER: Joi.boolean().default(true),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        sid: configService.get('DATABASE_DATABASE'),

        password: configService.get('DATABASE_PASSWORD'),
        autoLoadEntities: configService.get('DATABASE_AUTOLOADENTITIES'),
        synchronize: configService.get('DATABASE_SYNCHRONIZE'),
        logging: ['query', 'error'],
        //entities: [Cidade],
      }),
    }),
    CidadeModule,
  ],

  // IMPORTANTE: OS DADOS ACIMA, são secretos

  //  controllers: [], // Controllers handle incoming requests, é como se fosse o ponto de entrada da aplicação
  //  providers: [], //Providers are used to encapsulate business logic and can be injected into controllers or other providers,
  //  //é como se fosse o serviço que contém a lógica de negócio
  //  exports: [], //Exporting AppService allows it to be used in other modules
})
export class AppModule {}
