import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { CidadeModule } from '../cidade/cidade.module';
import { ResourceModule } from '../resources/resources.module';

// Atividade Do dia 15/04/2026 Criar Registro de Usuário
import { UsuarioModule } from '../usuario/usuario.module';
//
import { AuthModule } from '../auth/auth.module';

// Tarefa 2 - Alterar Senha
// import { AlterarSenhaModule } from 'src/alterar-senha/alterar-senha.module';

//const oracledb = require('oracledb') as typeof import('oracledb');

//oracledb.initOracleClient({
// libDir: 'E:/cocao/oracle/instantclient',
//});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(1521),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_DATABASE: Joi.string().required(),
        //DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_AUTOLOADENTITIES: Joi.boolean().default(true),
        DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
        //DATABASE_LOGGING: Joi.boolean().default(true),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        //sid: configService.get('DATABASE_DATABASE'), - acesso ao banco de dados oracle
        database: configService.get('DATABASE_DATABASE'),
        //password: configService.get('DATABASE_PASSWORD'),
        //autoLoadEntities: configService.get('DATABASE_AUTOLOADENTITIES'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: configService.get('DATABASE_SYNCHRONIZE'),
        logging: ['query', 'error'],
      }),
    }),
    CidadeModule,
    ResourceModule,

    UsuarioModule,
    AuthModule,

    // Tarefa 2 - Alterar Senha
    // AlterarSenhaModule,
  ],
})
export class AppModule {}
