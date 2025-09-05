import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CidadeModule } from 'src/cidade/cidade.module';

// IMPORTANTE: OS DADOS DE @Module SÃO SENSÍVEIS !!!
// E NÃO DEVEM SER FEITO UPLOAD DELES NO GITHUB

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'teste',
      host: 'aaaa',
      port: 123,
      username: '',
      database: '',
      password: '',
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
