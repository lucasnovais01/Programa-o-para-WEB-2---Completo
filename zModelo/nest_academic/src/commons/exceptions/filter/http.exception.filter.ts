import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { sendHttpResponse } from 'src/commons/mensagem/send.response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.message;
    const erro = exception.cause;

    return sendHttpResponse(
      res,
      status,
      //Timestamp: new Date().toISOString(),  // não precisa mandar
      message,
      null,
      req.path,
      erro,
    );
  }
}
/**
 * HTTP EXCEPTION FILTER - Sistema COCAO
 * Captura TODOS os HttpException da aplicação
 * Padroniza respostas de erro em JSON:
 *   { status, message, path, erro }
 *
 * Registrado globalmente em main.ts:
 *   app.useGlobalFilters(new HttpExceptionFilter());
 *
 * Usa: sendHttpResponse() → função comum de formatação
 *
 * NUNCA use: throw new Error()
 * SEMPRE use: throw new BadRequestException('mensagem')
 */
