import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './commons/exceptions/filter/http.exception.filter';

// Foi colocado o ValidationPipe global aqui, pq o POSTMAN tava dando erro 404,
// pq o DTO não tava sendo validado corretamente,

// !!! medida de desespero !!!
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do ValidationPipe global (FOI UMA MEDIDA DE DESESPERO)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuração de filtros globais
  app.useGlobalFilters(new HttpExceptionFilter());

  // TERCEIRA TENTATIVA (react está funcioando agora)

  app.enableCors({
    // Origens permitidas (development)
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://127.0.0.1:5173', // Vite alternativo
      'http://localhost:3000', // React padrão
    ],
    // Métodos permitidos, NÃO VOU USAR O OPTIONS, HEAD, PATCH. Coloquei por pra aprendizagem.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

    // Headers permitidos na requisição
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Origin'],

    // Headers expostos para o cliente
    exposedHeaders: ['Content-Length', 'Content-Type'],

    // Desativado credentials pois não estamos usando cookies/auth ainda
    credentials: false,

    // Cache da resposta preflight por 1 hora
    maxAge: 3600,
  });
  // Inicia o servidor na porta 8000
  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();

/*
O erro 404 é diferente do erro CORS anterior, o que indica que agora estamos realmente chegando ao servidor, 
mas a rota não está sendo encontrada.




  // NOVA Configuração 2.0 (com correções de CORS)

  app.enableCors({
    // Origens permitidas (development)
    origin: [
      'http://localhost:3000',   // React padrão
      'http://localhost:5173',   // Vite dev server
      'http://127.0.0.1:5173',  // Vite alternativo
    ],

    // Métodos permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    
    // Headers permitidos na requisição
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'Origin'
    ],

    // Headers expostos para o cliente
    exposedHeaders: ['Content-Length', 'Content-Type'],
    
    // Desativado credentials pois não estamos usando cookies/auth ainda
    credentials: false,
    
    // Cache da resposta preflight por 1 hora
    maxAge: 3600,
    
    // Permitir qualquer header na resposta
    preflightContinue: false
  });

*/

/*
  // Como eu consegui achar o que causava erro 404:
  // Log para debug: mostrar que o servidor está iniciando
  console.log('\nINICIANDO SERVIDOR:');
  console.log('URL Base:', 'http://localhost:' + (process.env.PORT ?? 8000));
*/
