import { HttpStatus } from '@nestjs/common';
import { NegocioException } from './negocio.exceptions';

export class EmailExceptions extends NegocioException {
  // No NestJS Se trocar a ordem
  constructor(message: string, statusCode: number, error?: string | null) {
    super({
      statusCode: statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      error: error ?? 'Erro interno no servidor',
    });
  }
}
