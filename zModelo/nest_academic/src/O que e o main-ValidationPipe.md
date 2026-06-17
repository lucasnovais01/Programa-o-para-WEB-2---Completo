## Aqui vou colocar scripts antigos, e informações didáticas relacionadas ao main.ts

Antigamente meu main.ts era assim:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './commons/exceptions/filter/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8000'], // [REMOVIDO] Não incluía porta do Vite
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: false,
  });

  await app.listen(process.env.PORT ?? 8000); // Default to port 8000, pq no react é 3000
}
void bootstrap();

  // MUDANÇA: Adição da porta 5173 do Vite nas origens permitidas
  // MOTIVO: Frontend está rodando com Vite na porta 5173 ao invés de 3000
  // CONTEXTO: ERR_NETWORK ocorrendo devido a bloqueio de CORS

/*
 * ============================================================== 
 * MAIN.TS – PONTO DE ENTRADA DA APLICAÇÃO
 * ============================================================== 
 * 
 * O que é?
 *   Arquivo que inicia o servidor NestJS.
 * 
 * Para que serve?
 *   1. Cria a aplicação com AppModule
 *   2. Registra o filtro global de erros (HttpExceptionFilter)
 *   3. Libera CORS para o React (localhost:3000)
 *   4. Inicia o servidor na porta 8000
 
 * Importante:
 *   - CORS: permite que o frontend acesse a API
 *   - Filtro global: padroniza TODOS os erros
 *   - Porta: 8000 (React usa 3000)
 *
 * NOTA SOBRE PREFIXO GLOBAL (ATUALIZAÇÃO - 06/11/2025):
 * --------------------------------------------------
 * - Comentário original que dizia "**Novo**: Prefixo global adicionado"
 *   foi removido/invalido porque a chamada a `app.setGlobalPrefix(...)`
 *   foi usada apenas durante a depuração e em seguida removida do código.
 * - Motivo: manter um prefixo global em `main.ts` enquanto as rotas já
 *   incluem a base (`/rest/sistema/v1/...`) na constante `ROTA` causaria
 *   duplicação de caminhos (ex.: "/rest/sistema/v1/rest/sistema/v1/...").
 * - Decisão tomada: retirar a chamada a `setGlobalPrefix` e usar as
 *   rotas geradas por `src/commons/constants/url.sistema.ts`. O comentário
 *   original foi mantido como histórico (comentário removido/invalidado).
 * - Observação: se preferir usar um prefixo global no futuro, remova
 *   a parte base das constantes `ROTA` ou ajuste as constantes de endpoint
 *   para evitar duplicações.
 * 
 * ==============================================================
 */

/*
 * ==============================================================
 * TUTORIAL: ValidationPipe
 * ==============================================================
 *
 * O QUE É:
 * --------
 * O ValidationPipe é um recurso do NestJS que automaticamente valida
 * os dados recebidos nas requisições com base nas decorações
 * definidas nos DTOs (Data Transfer Objects).
 *
 * CONFIGURAÇÃO USADA:
 * -----------------
 * app.useGlobalPipes(new ValidationPipe({
 *   transform: true,           // Converte tipos automaticamente (string -> number, etc)
 *   whitelist: true,          // Remove propriedades não decoradas no DTO
 *   forbidNonWhitelisted: true // Rejeita requisições com props extras
 * }));
 *
 * COMO FUNCIONA:
 * -------------
 * 1. Quando uma requisição chega (ex: POST /hospede/criar):
 *    - O ValidationPipe pega o body da requisição
 *    - Compara com as decorações no DTO (HospedeRequest)
 *    - Exemplo: @IsEmail(), @IsNotEmpty(), etc.
 *
 * 2. Se encontrar violações:
 *    - Retorna erro 400 (Bad Request)
 *    - Lista todas as validações que falharam
 *
 * 3. Se tudo ok:
 *    - Converte os dados para os tipos corretos
 *    - Passa para o controller processar
 *
 * EXEMPLO PRÁTICO:
 * --------------
 * No HospedeRequest:
 * @IsEmail()
 * email?: string;
 *
 * Se enviar email inválido:
 * {
 *   "statusCode": 400,
 *   "message": ["email must be a valid email"],
 *   "error": "Bad Request"
 * }
 *
 * VANTAGENS:
 * ---------
 * 1. Validação automática e consistente
 * 2. Reduz código boilerplate nos controllers
 * 3. Melhor experiência para o cliente da API
 * 4. Tipo-segurança com TypeScript
 *
 * ==============================================================
 */
