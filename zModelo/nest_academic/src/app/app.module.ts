import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as Joi from 'joi';
// Importa os 9 módulos da aplicação:
import { HospedeModule } from 'src/1-hospede/hospede.module';
import { EmailModule } from 'src/10-mail/email.module';
import { FuncaoModule } from 'src/2-funcao/funcao.module';
import { FuncionarioModule } from 'src/3-funcionario/funcionario.module';
import { TipoQuartoModule } from 'src/4-tipo-quarto/tipo-quarto.module';
import { QuartoModule } from 'src/5-quarto/quarto.module';
import { ResourceModule } from 'src/8-resources/resources.module';
import { AuthModule } from 'src/9-auth/auth.module';

// era antigo usando o oracle
// const oracledb = require('oracledb') as typeof import('oracledb');
// oracledb.initOracleClient({
//   libDir: 'C:\Oracle client\instantclient_23_9',
// });

/*
// Foi criado o arquivo oracle-client.config.ts para isolar esta configuração específica do OracleDB:
import * as oracledb from 'oracledb';

oracledb.initOracleClient({
  libDir: 'C:\\Oracle client\\instantclient_23_9',
});
*/

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
    // 3. Módulo da Aplicação // Importa os módulos
    HospedeModule,
    FuncaoModule,
    FuncionarioModule,
    TipoQuartoModule,
    QuartoModule,
    ResourceModule,
    AuthModule,
    EmailModule,
    /*
    StatusReservaModule,
    ReservaModule,
    ServicoModule,
    HospedeServicoModule,
    */
    // AlterarSenhaModule,
  ],
})
export class AppModule {}

/*
 * ==============================================================
 * TUTORIAL RÁPIDO: app.module.ts (O Módulo Raiz)
 * ==============================================================
 * * O que é?
 * - Este é o módulo principal (Raiz) da sua aplicação NestJS.
 * - Ele é o ponto de partida que "amarra" todos os outros módulos (como HospedeModule),
 * configurações (ConfigModule) e conexões (TypeOrmModule).
 * * Como funciona? (Seguindo o padrão do professor)
 * 1. `oracledb.initOracleClient`: (Específico do Oracle) Inicializa o client do OracleDB,
 * apontando para a pasta onde os drivers (libDir) estão instalados na máquina.
 * 2. `ConfigModule.forRoot`: Carrega e valida variáveis de ambiente (do arquivo .env).
 * - `isGlobal: true`: Torna as variáveis de ambiente acessíveis em toda a aplicação.
 * - `validationSchema (Joi)`: Garante que o .env contenha todas as chaves obrigatórias.
 * 3. `TypeOrmModule.forRootAsync`: Conecta-se ao banco de dados DEPOIS que o `ConfigModule`
 * estiver pronto (por isso é 'Async').
 * - `useFactory`: Uma função que usa o `ConfigService` injetado para construir a
 * configuração do TypeORM com os dados do .env (usuário, senha, host, etc.).
 * - `synchronize: false`: Correto para produção. Evita que o TypeORM tente alterar
 * o banco de dados; o DDL é o responsável pelo schema.
 * 4. `HospedeModule`: (Esta foi a refatoração) Importa o módulo do Hóspede,
 * "ligando" todo o CRUD de Hóspede na aplicação principal.
 * * ==============================================================
 */
