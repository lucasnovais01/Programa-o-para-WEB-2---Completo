import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './commons/exceptions/filters/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const configSwagger = new DocumentBuilder()
    .setTitle('Sistema Acadêmico')
    .setDescription('API para gestão acadêmica')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('api_academico', app, document);

  /*
  app.enableCors({
    // libera o cors

    origin: ['http://localhost:3000', 'http://localhost:8000'], // endereço do react
    methods: 'GET, POST, PUT, DELETE',
    allowedheaders: 'Content-Type, Accept',
    credentials: false,
  });
*/

  await app.listen(process.env.PORT ?? 5000); // Default to port 8000, pq no react é 3000
}
void bootstrap();
// http://localhost:8000/rest/sistema/cidade/criar

// http://localhost:8000

// http://localhost:8000/cidade/listar
// http://localhost:8000/cidade/listar/1
// http://localhost:8000/cidade/criar
// http://localhost:8000/cidade/atualizar/1
// http://localhost:8000/cidade/remover/1
