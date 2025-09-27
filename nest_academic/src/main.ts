import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './commons/exceptions/filter/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 8000); // Default to port 8000, pq no react é 3000
}

void bootstrap();

// http://localhost:8000/rest/sistema/cidade/criar

// http://localhost:8000

// http://localhost:8000/cidade/listar
// http://localhost:8000/cidade/listar/1
// http://localhost:8000/cidade/criar
// http://localhost:8000/cidade/atualizar/1
// http://localhost:8000/cidade/remover/1
