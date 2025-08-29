import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8000); // Default to port 8000, pq no react é 3000
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
