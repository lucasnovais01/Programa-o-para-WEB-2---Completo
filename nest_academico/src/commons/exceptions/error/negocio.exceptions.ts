import { HttpException } from '@nestjs/common';

export interface ExceptionPayload {
  statusCode: number; // codigos http 200, 300, 400, ...
  message: string; // "Falha no servidor de email"
  error?: string | null; // "Conflito de email de cadastro no email"
}

export class NegocioException extends HttpException {
  constructor(payload: ExceptionPayload) {
    super(payload, payload.statusCode); // Envia para o PAI
  }
}
