import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  //HttpStatus, // DIFERENTE DO MODELO DO PROFESSOR
} from '@nestjs/common';
import { Request, Response } from 'express';
import { sendHttpResponse } from '../../mensagem/send.response';
// import { MensagemSistema } from '../../mensagem/mensagem.sistema';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  //
  catch(exception: HttpException, host: ArgumentsHost) {
    //
    //catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    //
    const status = exception.getStatus();
    const message = exception.message;
    const erro = exception.cause;

    /*
    // Adicione esta verificação simples
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // 500 para erros genéricos

    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof Error
          ? exception.message
          : 'Erro interno inesperado';

    const erro =
      exception instanceof HttpException ? exception.cause : exception; // ou undefined
    */

    return sendHttpResponse(res, status, message, null, req.path, erro, null);
  }
}

/*
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,  // ← adicione isso
} from '@nestjs/common';
import { Request, Response } from 'express';
import { sendHttpResponse } from '../../mensagem/send.response';

@Catch()  // continua pegando tudo (bom para global)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {  // ← mude de HttpException para unknown
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Adicione esta verificação simples
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;  // 500 para erros genéricos

    const message = exception instanceof HttpException 
      ? exception.message 
      : (exception instanceof Error ? exception.message : 'Erro interno inesperado');

    const erro = exception instanceof HttpException 
      ? exception.cause 
      : exception;  // ou undefined, se preferir

    return sendHttpResponse(res, status, message, null, req.path, erro);
  }
}
*/
