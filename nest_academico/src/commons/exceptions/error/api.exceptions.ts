import { HttpStatus } from '@nestjs/common';
import { NegocioException } from './negocio.exceptions';

export class ApiException extends NegocioException {
  constructor(
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    message: string,
    error?: string | null,
  ) {
    super({
      statusCode: statusCode,
      message,
      error: error ?? 'Erro de regra de negócio',
    });
  }
}
